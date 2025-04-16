import React, { useState, Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { AllLoader } from "@/components";
import Image from "next/image";
import { FormButtons } from "../inputComponent/InputComponent";
import { withLoading, apiRequest } from "@/utils/apiUtils";
import { useAlert } from "@/contexts/AlertContext";

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
  selected_user_type
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (formData.image && typeof formData.image === 'string') {
      setImagePreview(formData.image);
    }
  }, [formData]);
  
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevFormData => ({
          ...prevFormData,
          image: file
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      image: null
    }));
    setImagePreview(null);
  };


  async function onSubmitHandler() {
    const type = "files";
    const authToken = localStorage.getItem("authToken");
    let initialFormData;
    let apiUrl;
    let routeName;

    if (selected_user_type === "applicant") {
      initialFormData = localStorage.getItem('applicant_profile');
      apiUrl = `/applicant/?user_id=${userid}&type=${type}`
      routeName = "UpdateApplicantData"
    } else if (selected_user_type === "student") {
      initialFormData = localStorage.getItem('student_profile');
      apiUrl = `/student/?user_id=${userid}&type=${type}`
      routeName = "UpdateStudentData"
    }
    
    const userType = localStorage.getItem("userType");

    if (initialFormData === JSON.stringify(formData)) {
      if (userType === "applicant") {
        router.push("/applicant");
      }
      if (userType === "admin") {
        if (selected_user_type === "applicant") {
          router.push("/admin/manage/applicants/profile");
        } else if (selected_user_type === "student") {
          router.push("/admin/manage/students/profile");
        }
      }
      return true;
    }

    const data = new FormData();
    // if (formData.image instanceof File) {
    //   data.append("image", formData.image);
    // }
    data.append("image", formData.image);

    if (selected_user_type === "student") {
      localStorage.setItem("student_profile", JSON.stringify(formData));
      showAlert("Student data updated");
      return true;
    }

    const fileType = 'image-file';
    const wrappedApiRequest = withLoading(
      apiRequest, 
      setLoading, 
      showAlert, 
      routeName
    );
    
    try {
      const response = await wrappedApiRequest(
        apiUrl, 
        "PUT",
        data, 
        authToken, 
        routeName,
        fileType
      );
  
      if (!response.success || !response.status) {
        showAlert(response.message || `Failed to update ${selected_user_type} data`);
        setLoading(false);
        return false;
      }

      if (selected_user_type === "student") {
        localStorage.setItem("student_profile", JSON.stringify(formData));
      } else if (selected_user_type === "applicant") {
        localStorage.setItem("applicant_profile", JSON.stringify(formData));
      }
      showAlert(response.message);
      setLoading(false);
      if (userType === "applicant") {
        router.push("/applicant");
      }
      if (userType === "admin") {
        if (selected_user_type === "applicant") {
          router.push("/admin/manage/applicants/profile");
        } else if (selected_user_type === "student") {
          router.push("/admin/manage/students/profile");
        } 
      }
      return true;
  
    } catch (error) {
      console.error(`Error in updating ${selected_user_type} data:`, error);
      showAlert(error.message || `Failed to update ${selected_user_type} data`);
      setLoading(false);
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
          clearFormData={handleClearImage}
          onSubmitHandler={onSubmitHandler}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </form>
    </Fragment>
  );
};

export default FileUpload;