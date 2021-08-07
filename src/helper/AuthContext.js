import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "./Firebase"
import accounts from './accounts.json'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [currentAddress, setCurrentAddress] = useState()
  const [signKey, setSignKey] = useState()
  const [loading, setLoading] = useState(true)
  const [currentPass, setCurrentPass] = useState('')
  const [key, setKey] = useState({pubkey:'', privkey:''})
  const [uid, setUid] = useState({pubkey:'', privkey:''})

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
      const y = result["y"];
      const x = result["x"];
      const balance = message['balance']
      setKey({pubkey:y, privkey:x})
      setSignKey(message['privateKey']);
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
      setCurrentUser(user)
      if (user){
        const docRef = db.collection("users").doc(user.uid);
        docRef.get().then((doc) => {
        if (doc.exists) {
            const addr = doc.data().address;
            setCurrentAddress(addr);
            // setSignKey()
            getKey(user.uid, addr);
        }else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            setCurrentAddress('')
            setCurrentPass('')
            //getPubkey

          }
          }).catch((error) => {
            console.log("Error getting document:", error);
            setCurrentAddress('')
            });
      }else{
        setCurrentAddress(null);
      }
      setLoading(false)
    })

      return unsubscribe
    }, [])

  const value = {
    currentUser,
    currentAddress,
    currentPass,
    key,
    signKey,
    login,
    loading,
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
