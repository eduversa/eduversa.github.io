import React, { createContext, useState, useContext } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ isOpen: false, message: "" });

  const showAlert = (message) => setAlert({ isOpen: true, message });
  const closeAlert = () => setAlert({ isOpen: false, message: "" });

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
