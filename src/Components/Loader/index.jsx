import { CircularProgress } from "@mui/material";
import React from "react";

const Loader = () => {
  return (
    <div className="z-50 fixed left-0 top-0 flex justify-center items-center h-screen w-screen bg-[rgba(0,0,0,0.2)]">
      <CircularProgress sx={{ color: "blue" }} />
    </div>
  );
};

export default Loader;
