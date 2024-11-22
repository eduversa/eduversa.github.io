import React, { useState, useEffect, Fragment, useRef } from "react";
import { AllLoader } from "@/components";
import {
  Text,
  Email,
  Number,
  Select,
  DateInput,
  Aadhar,
  Pan,
  PhoneNumber,
  Pincode,
  FormButtons,
  Name,
  TextNoNumber,
} from "../inputComponent/InputComponent";
import AddressComponent from "../inputComponent/AddressComponent";
import { withLoading, apiRequest } from "@/utils/apiUtils";
import { useAlert } from "@/contexts/AlertContext";

const FamilyInfo = ({
  formData,
  setFormData,
  clearFormData,
  handleChange,
  handlePreviousClick,
  handleNextClick,
  currentStep,
  totalSteps,
  userid,
  selected_user_type,
  officePincodeError,
  setOfficePincodeError,
}) => {

  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  //fn to change the fields of guardian based on the relation field
  const handleRelationChange = (event) => {
    handleChange(event);
    const relation = event.target.value;
    if (relation === "father" || relation === "mother") {
      const parentInfo = formData.family_info[relation];
      const updatedGuardianInfo = {
        ...formData.family_info.guardian,
        name: parentInfo.name,
        email: parentInfo.email,
        contact: parentInfo.contact
      };
      handleChange({ target: { name: "family_info.guardian", value: updatedGuardianInfo } });
    }
  };

  useEffect(() => {
    const relation = formData.family_info.guardian.relation;
    if (relation === "father" || relation === "mother") {
        const parentInfo = formData.family_info[relation];
        const updatedGuardianInfo = {
            ...formData.family_info.guardian,
            name: parentInfo.name,
            email: parentInfo.email,
            contact: parentInfo.contact
        };
        if (JSON.stringify(updatedGuardianInfo) !== JSON.stringify(formData.family_info.guardian)) {
            handleChange({ target: { name: "family_info.guardian", value: updatedGuardianInfo } });
        }
    }
  }, [formData.family_info, handleChange]);
  

  async function onSubmitHandler() {
    const type = "family"; 
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
  
    if (initialFormData === JSON.stringify(formData)) {
      return true;
    }
  
    const data = JSON.stringify(formData.family_info);
    
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
        routeName
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
        <h3 className="sub-heading">Father&apos;s Information</h3>
        <Name
          label="Full Name"
          name="family_info.father.name"
          value={formData.family_info.father.name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          <Email
            label="Email"
            name="family_info.father.email"
            value={formData.family_info.father.email}
            onChange={handleChange}
          />
          <PhoneNumber
            label="Contact Number"
            name="family_info.father.contact"
            value={formData.family_info.father.contact}
            onChange={handleChange}
          />
        </div>
        <hr />
        <h3 className="sub-heading">Mother&apos;s Information</h3>
        <Name
          label="Full Name"
          name="family_info.mother.name"
          value={formData.family_info.mother.name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          <Email
            label="Email"
            name="family_info.mother.email"
            value={formData.family_info.mother.email}
            onChange={handleChange}
          />
          <PhoneNumber
            label="Contact Number"
            name="family_info.mother.contact"
            value={formData.family_info.mother.contact}
            onChange={handleChange}
          />
        </div>
        <hr />
        <h3 className="sub-heading">Guardian&apos;s Information</h3>
        <Name
          label="Full Name"
          name="family_info.guardian.name"
          value={formData.family_info.guardian.name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          {/* <Text
            label="Relation"
            name="family_info.guardian.relation"
            value={formData.family_info.guardian.relation}
            onChange={handleChange}
            required
          /> */}
          <Select
            label="Relation"
            name="family_info.guardian.relation"
            value={formData.family_info.guardian.relation}
            onChange={handleRelationChange}
            required
            options={[
              { key: "Select Relation", value: "" },
              { key: "Father", value: "father" },
              { key: "Mother", value: "mother" },
              { key: "Others", value: "other" },
            ]}
          />
          <TextNoNumber
            label="Occupation"
            name="family_info.guardian.occupation"
            value={formData.family_info.guardian.occupation}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2">
          <Email
            label="Email"
            name="family_info.guardian.email"
            value={formData.family_info.guardian.email}
            onChange={handleChange}
            required
          />
          <PhoneNumber
            label="Contact Number"
            name="family_info.guardian.contact"
            value={formData.family_info.guardian.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-3">
          <TextNoNumber
            label="Designation"
            name="family_info.guardian.designation"
            value={formData.family_info.guardian.designation}
            onChange={handleChange}
            required
          />
          <PhoneNumber
            label="Office Contact"
            name="family_info.guardian.office_contact"
            value={formData.family_info.guardian.office_contact}
            onChange={handleChange}
            required
          />
          <Number
            label="Income"
            name="family_info.guardian.income"
            value={formData.family_info.guardian.income}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2">
          <Aadhar
            label="Aadhar Number"
            name="family_info.guardian.aadhar_number"
            value={formData.family_info.guardian.aadhar_number}
            onChange={handleChange}
            required
          />
          <Pan
            label="Pan Number"
            name="family_info.guardian.pan_number"
            value={formData.family_info.guardian.pan_number}
            onChange={handleChange}
            required
          />
        </div>
        <h4 className="sub-sub-heading">Office Address</h4>{" "}
        <AddressComponent
          addressPath="family_info.guardian.office_address"
          formData={formData}
          handleChange={handleChange}
          pincodeError={officePincodeError}
          setPincodeError={setOfficePincodeError}
          required
        />
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

export default FamilyInfo;
