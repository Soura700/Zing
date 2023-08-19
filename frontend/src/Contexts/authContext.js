import React , { createContext, useContext, useState } from "react";


const AuthContext = createContext();

export const useAuth = () => {

  return useContext(AuthContext); //Consumin the value ...Instead we have to write useContext(name of the context)  int every component we will just call the function ... it will do the same work
  
}


export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check authentication status and set isLoggedIn
  const checkAuthentication = async () => {
    try {
      const response = await fetch("/check-cookie");
      const data = await response.json();

      if (response.status === 200) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const AuthProvider = ({ childres }) => {
    <AuthContext.Provider value={(isLoggedIn, checkAuthentication)}>
      {childres}
    </AuthContext.Provider>;
  };

  return AuthProvider;

};


// Need Changes (19/08/2023)