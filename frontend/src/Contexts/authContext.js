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
        // "http://localhost:5000/api/auth/check-cookie",
        "https://zing-media.onrender.com/api/auth/check-cookie",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.status == 200) {
        setIsLoggedIn(true);
        setUserId(data);
        return data;
      } else {
        if(response.status === 400){
          // window.location.href = 'http://localhost:3000/login'
          window.location.href = '/login'
          // window.location.href = 'https://zing-five.vercel.app/login'
        }
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
