/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./ImagePreview.module.scss";
import IconButton from "../common/IconButton/IconButton";
import { FaTimes, FaCheckCircle } from "react-icons/fa";

const ImagePreview = ({ imagePreviewUrl, removeImage }) => {
  if (!imagePreviewUrl) {
    return null;
  }

  return (
    <div className={styles.imagePreviewContainer} aria-live="polite">
      <img
        src={imagePreviewUrl}
        alt="Selected Preview"
        className={styles.previewImage}
      />
      <IconButton
        icon={FaTimes}
        onClick={removeImage}
        title="Remove Image"
        aria-label="Remove selected image"
        className={styles.removeButtonWrapper}
        size="1em"
      />
      <div className={styles.statusText}>
        <FaCheckCircle className={styles.checkIcon} aria-hidden="true" />
        Image ready to send
      </div>
    </div>
  );
};

export default ImagePreview;
