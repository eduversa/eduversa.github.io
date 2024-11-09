import React from "react";
import { useAlert } from "../contexts/AlertContext";

const AlertModal = () => {
  const { alert, closeAlert } = useAlert();

  if (!alert.isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeAlert}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{alert.message}</p>
        <button onClick={closeAlert} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
