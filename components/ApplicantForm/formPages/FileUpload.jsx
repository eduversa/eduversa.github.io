import React, { useState, Fragment } from "react";
import Image from "next/image";
import { FormButtons } from "../inputComponent/InputComponent";
import { updateAppplicantData } from "@/functions";
const FileUpload = ({
  formData,
  setFormData,
  clearFormData,
  handleChange,
  handlePreviousClick,
  handleNextClick,
  currentStep,
  totalSteps,
}) => {
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
  async function onSubmitHandler() {
    const image = document.getElementById("user-image");
    const profileData = new FormData();
    profileData.append("image", image.files[0]);
    const data = profileData;
    const type = "files";
    const user_id = localStorage.getItem("userid");
    const fileTypes = "files";
    try {
      console.log(type, data, user_id);
      const response = await updateAppplicantData(
        user_id,
        type,
        data,
        fileTypes
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Fragment>
      <form
        className="page--content"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitHandler();
          handleNextClick();
        }}
      >
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
        <FormButtons
          handlePreviousClick={handlePreviousClick}
          clearFormData={() => clearFormData(currentStep)}
          onSubmitHandler={onSubmitHandler}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </form>
    </Fragment>
  );
};

export default FileUpload;
