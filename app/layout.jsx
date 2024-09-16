import React from "react";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="flex items-center justify-center bg-gray-100 ">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
