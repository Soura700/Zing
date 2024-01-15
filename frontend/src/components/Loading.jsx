import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingComponent = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
    <p>Loading...</p>
  </div>
);

export default LoadingComponent;
