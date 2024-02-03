// RightBarContext.jsx
import React, { createContext, useState, useContext } from "react";

const RightBarContext = createContext();

export const RightBarProvider = ({ children }) => {
  const [showRightBar, setShowRightBar] = useState(false);

  const toggleRightBar = () => {
    setShowRightBar(!showRightBar);
  };

  return (
    <RightBarContext.Provider value={{ showRightBar, toggleRightBar }}>
      {children}
    </RightBarContext.Provider>
  );
};

export const useRightBar = () => {
  return useContext(RightBarContext);
};
