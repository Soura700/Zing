import React, { createContext, useState, useContext } from "react";


const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [ id , setUserId ] = useState(null);


  // Function to check authentication status and set isLoggedIn
  const checkAuthentication = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/check-cookie",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();


      if (response.status == 200) {
        

        // setUserId(data);
        
        setIsLoggedIn(true);


        setUserId(data);
        

        console.log("IsLogged In"  + isLoggedIn);

        return data;


      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, id , checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};
