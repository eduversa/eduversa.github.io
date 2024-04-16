import React, { useState, Fragment } from "react";
import { useRouter } from "next/router";
import { AllLoader } from "@/components";
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
  userid,
}) => {
  const [imagePreview, setImagePreview] = useState(formData.image);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
    setLoading(true);
    const userType = localStorage.getItem("userType");

    // check to see if tehre are any changes to the form
    const initialFormData = localStorage.getItem('applicant_profile');
    if (initialFormData === JSON.stringify(formData)) {
      setLoading(false);
      if (userType === "applicant") {
        router.push("/applicant");
      }
      if (userType === "admin") {
        router.push("/admin/manage/applicants/profile");
      }
      return true;
    }
    const image = document.getElementById("user-image");
    const profileData = new FormData();
    profileData.append("image", image.files[0]);
    const data = profileData;
    const type = "files";
    // const userid = localStorage.getItem("userid");
    const fileTypes = "files";
    try {
      if (process.env.NODE_ENV === "development") {
        console.log(type, data, userid);
      }
      const response = await updateAppplicantData(
        userid,
        type,
        data,
        fileTypes
      );
      if (!response.status) {
        alert(response.message);
        setLoading(false);
        return false;
      }
      if (process.env.NODE_ENV === "development") {
        // const response = await updateAppplicantData(
        //   userid,
        //   type,
        //   data,
        //   fileTypes
        // );
        console.log(response);
      }
      localStorage.setItem("applicant_profile", JSON.stringify(formData));
      alert(response.message);
      setLoading(false);
      if (userType === "applicant") {
        router.push("/applicant");
      }
      if (userType === "admin") {
        router.push("/admin/manage/applicants/profile");
      }
      return true;

    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
      return false;
    }
  }

  return (
    <Fragment>
      {loading && <AllLoader />}
      <form
        className="page--content"
        onSubmit={async (event) => {
          event.preventDefault();
          const success = await onSubmitHandler();
          if (success) {
            handleNextClick();
          }
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
