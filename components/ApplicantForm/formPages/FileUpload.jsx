import React, { useState } from "react";
import { ImageUpload } from "../inputComponent/InputComponent";
import Image from "next/image";

const FileUpload = ({
  formData,
  setFormData,
  handleSave,
  handlePreviousClick,
  handleSubmit,
}) => {
  const [imagePreview, setImagePreview] = useState(formData.image);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page">
      <h2 className="page--title">File Upload</h2>
      <form className="page--content" onSubmit={handleSubmit}>
        <div className="image-upload">
          {imagePreview && (
            <div className="image-preview">
              {/* <img src={imagePreview} alt="Preview" /> */}
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={200}
              />
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

        {/* <Image 
          label="Upload Image"
          name="user-image"
          id="user-image"
          onChange={handleFileInputChange}
          imagePreview={imagePreview}
        /> */}

        <div className="btns">
          <button type="button" className="btn" onClick={handlePreviousClick}>
            Prev
          </button>
          <button type="button" className="btn" onClick={handleSave}>
            Save
          </button>
          <button type="submit" className="btn">
            Submit
          </button>
        </div>
      </form>
      {/* {selectedFile && (
        <div>
          <h3>Selected File:</h3>
          <p>{selectedFile.name}</p>
          <button type="button" onClick={handleRemoveFile}>
            Remove File
          </button>
        </div>
      )} */}
    </div>
  );
};

export default FileUpload;
