import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "./Firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [currentAddress, setCurrentAddress] = useState()
  const [loading, setLoading] = useState(true)
  const [currentPass, setCurrentPass] = useState('')
  const [key, setKey] = useState({pubkey:'', privkey:''})

//   function signup(email, password) {
//     return auth.createUserWithEmailAndPassword(email, password)
//   }

  function login(email, password) {
    setCurrentPass(password)
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  async function getKey(){
    console.log(accId)
    const response = await fetch("/getKey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accId : password
      }),
    })

    let result
    await response.json().then((message) => {
      result = message["data"];
      const y = result["y"];
      const x = result["x"];
      const g = result['g']
      setKey({pubkey:y, privkey:x})
    });
  }

  async function createKey(){
    const response = await fetch("/genKey", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })

    let result
    await response.json().then((message) => {
      result = message["data"];
      const y = result["y"];
      const x = result["x"];
      const g = result['g']
      setKey({pubkey:y, privkey:x})
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
        console.log(user.uid);
        const docRef = db.collection("users").doc(user.uid);
        docRef.get().then((doc) => {
        if (doc.exists) {
            const addr = doc.data().address;
            const hasPubkey = doc.data().pubKey;
            console.log(addr)           
            setCurrentAddress(addr);
            if (hasPubkey){
              setKey();
            }else{
              createKey();
            }

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
    login,
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
