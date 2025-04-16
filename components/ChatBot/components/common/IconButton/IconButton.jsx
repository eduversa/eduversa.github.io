import React from "react";
import styles from "./IconButton.module.scss";

const IconButton = ({
  icon: Icon,
  onClick,
  title,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
  size = "1.2em",
  active = false,
}) => {
  const combinedClassName = `
    ${styles.iconButtonWrapper}
    ${active ? styles.active : ""}
    ${className}
  `;

  return (
    <div className={combinedClassName}>
      <button
        type="button"
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={styles.iconButton}
        aria-label={ariaLabel || title}
      >
        <Icon size={size} />
      </button>
    </div>
  );
};

export default IconButton;
