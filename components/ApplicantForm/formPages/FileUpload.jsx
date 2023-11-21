import React, { useState, Fragment } from "react";
import Image from "next/image";

const FileUpload = ({ formData, setFormData, handleChange }) => {
  const [imagePreview, setImagePreview] = useState(formData.image);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        handleChange({ target: { name: "image", value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Fragment>
      <div className="image-upload">
        {imagePreview && (
          <div className="image-preview">
            <Image
              className="image"
              src={imagePreview}
              alt="Preview"
              width={200}
              height={200}
            />
            {/* <img src={imagePreview} alt="Preview" /> */}
          </div>
        )}

        <label htmlFor="user-image" className="btn">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          name="user-image"
          id="user-image"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />
      </div>
    </Fragment>
  );
};

export default FileUpload;
