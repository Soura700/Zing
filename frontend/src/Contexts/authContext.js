import React, { createContext, useState, useContext } from "react";
// import { get } from '../../../backend/routes/registerAuth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        
        console.log(data)

        
        setIsLoggedIn(true);

        return data;

      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};
