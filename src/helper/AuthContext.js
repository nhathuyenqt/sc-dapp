import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "./Firebase"
import accounts from './accounts.json'
import xtype from 'xtypejs'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [currentBCAccount, setCurrentBCAccount] = useState({address:'', privateKey:''})
  const [loading, setLoading] = useState(true)
  const [currentPass, setCurrentPass] = useState('')
  const [keypair, setKeypair] = useState({x:'', y:''})
  const [uid, setUid] = useState('')
  const [balance, setBalance] = useState({CL:'', CR:'', b:''})

//   function signup(email, password) {
//     return auth.createUserWithEmailAndPassword(email, password)
//   }

  function login(email, password) {
    setLoading(true);
    setCurrentPass(password)
    // setCurrentAddress({...currentAddress, address: address});
    auth.signInWithEmailAndPassword(email, password)

  }

  function logout() {
    return auth.signOut()
  }

  async function getKey(uid, address){
    const response = await fetch("/fetchKey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        'uid' : uid,
        'address' :address
      }),
    })

    let result
    await response.json().then((message) => {
      result = message["data"];
      // const y_value = result.y;
      // const x_value = result.x;
      setKeypair(result);
      setBalance(message['balance'])
      // setSignKey(message['privateKey']);
      setCurrentBCAccount({address: address, privateKey:message['privateKey']});
    });
  }

  function writeUserData(userId, name, email, imageUrl) {
    db.ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }

//   function resetPassword(email) {
//     return auth.sendPasswordResetEmail(email)
//   }

//   function updateEmail(email) {
//     return currentUser.updateEmail(email)
//   }

//   function updatePassword(password) {
//     return currentUser.updatePassword(password)
//   }


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoading(true);
      setCurrentUser(user)
      if (user){
        const docRef = db.collection("users").doc(user.uid);
        docRef.get().then((doc) => {
        if (doc.exists) {
            const addr = doc.data().address;
            setCurrentBCAccount({...currentBCAccount, address:addr});
            // setSignKey()
            getKey(user.uid, addr);
        }else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            setCurrentBCAccount({address:'', privateKey:''})
            setKeypair({x:'', y:''})
            setCurrentPass('')
            setBalance({CL:'', CR:'', b:''})
            //getPubkey

          }
          }).catch((error) => {
            console.log("Error getting document:", error);
            
            });
      }else{
        setCurrentBCAccount({address:'', privateKey:''})
        setKeypair({x:'', y:''})
        setBalance({CL:'', CR:'', b:''})
      }
      setLoading(false)
    })

      return unsubscribe
    }, [])

  const value = {
    currentUser,
    currentBCAccount,
    currentPass,
    keypair,
    login,
    loading,
    balance,
    // signup,
    logout,
    // resetPassword,
    // updateEmail,
    // updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
