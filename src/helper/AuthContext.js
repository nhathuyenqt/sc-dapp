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

//   function signup(email, password) {
//     return auth.createUserWithEmailAndPassword(email, password)
//   }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
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
            setCurrentAddress(addr)
          }else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
          }).catch((error) => {
            console.log("Error getting document:", error);
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
