import React from "react";
import styles from "./StatusIndicator.module.scss";
import { FaInfoCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

const StatusIndicator = ({ type = "info", message, showSpinner = false }) => {
  if (!message) return null;

  let IconComponent;
  let typeClass = styles.info;

  switch (type) {
    case "error":
      IconComponent = FaExclamationTriangle;
      typeClass = styles.error;
      break;
    case "warning":
      IconComponent = FaExclamationTriangle;
      typeClass = styles.warning;
      break;
    case "loading":
      IconComponent = FaSpinner;
      typeClass = styles.loading;
      break;
    case "speaking":
      typeClass = styles.speaking;
      break;
    case "info":
    default:
      IconComponent = FaInfoCircle;
      typeClass = styles.info;
  }

  return (
    <div className={`${styles.statusIndicator} ${typeClass}`}>
      {showSpinner || type === "loading" ? (
        <FaSpinner className={styles.spinner} aria-hidden="true" />
      ) : (
        IconComponent && (
          <IconComponent className={styles.icon} aria-hidden="true" />
        )
      )}
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default StatusIndicator;
