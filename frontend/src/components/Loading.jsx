import React from "react";
import "../components/loading.css"
import Logo from "../../src/assets/buzz_logo.svg";

const LoadingComponent = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <img src={Logo} />
     <div class="loader"></div> 
  </div>
);

export default LoadingComponent;
