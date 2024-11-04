import React, { useState, Fragment } from "react";
import { AllLoader } from "@/components";
import { updateAppplicantData } from "@/functions";
import {
  Name,
  Email,
  Select,
  Aadhar,
  Pan,
  PhoneNumber,
  FormButtons,
  Dob,
} from "../inputComponent/InputComponent";
import AddressComponent from "../inputComponent/AddressComponent";

const PersonalInfo = ({
  formData,
  setFormData,
  clearFormData,
  handleChange,
  handlePreviousClick,
  handleNextClick,
  currentStep,
  totalSteps,
  userid,
  presentPincodeError,
  setPresentPincodeError,
  permanentPincodeError,
  setPermanentPincodeError,
}) => {
  const [loading, setLoading] = useState(false);
  const [areAddressesSame, setAreAddressesSame] = useState(formData.personal_info.are_addresses_same);

  const copyAddress = (e) => {
    const isChecked = e.target.checked;
    setAreAddressesSame(isChecked);

    const updatedFormData = {
      ...formData,
      personal_info: {
        ...formData.personal_info,
        permanent_address: isChecked 
          ? { ...formData.personal_info.present_address }
          : {
              street: "",
              pincode: "",
              city: "",
              district: "",
              state: "",
            },
        are_addresses_same: isChecked,
      },
    };
    handleChange({ target: { name: "formData", value: updatedFormData } });
  };

  async function onSubmitHandler() {

    // check to see if tehre are any changes to the form
    const initialFormData = localStorage.getItem('applicant_profile');
    if (initialFormData === JSON.stringify(formData)) {
      return true;
    }
    setLoading(true);
    const data = JSON.stringify(formData.personal_info);
    const type = "personal";
    // const userid = localStorage.getItem("userid");
    try {
      const response = await updateAppplicantData(userid, type, data);
      if (!response.status) {
        alert(response.message);
        setLoading(false);
        return false;
      }
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
      localStorage.setItem("applicant_profile", JSON.stringify(formData));
      alert(response.message);
      setLoading(false);
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
        <Name
          label="Full Name"
          name="personal_info.name"
          value={formData.personal_info.name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          <Email
            label="Email"
            name="personal_info.email"
            value={formData.personal_info.email}
            onChange={handleChange}
            required
          />
          <PhoneNumber
            label="Contact Number"
            name="personal_info.contact"
            value={formData.personal_info.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2">
          <Select
            label="Gender"
            name="personal_info.gender"
            value={formData.personal_info.gender}
            onChange={handleChange}
            required
            options={[
              { key: "Select Gender", value: "" },
              { key: "Male", value: "male" },
              { key: "Female", value: "female" },
              { key: "Others", value: "others" },
            ]}
          />
          <Dob
            label="Date of Birth"
            name="personal_info.dob"
            value={formData.personal_info.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2">
          <Select
            label="Category"
            name="personal_info.category"
            value={formData.personal_info.category}
            onChange={handleChange}
            required
            options={[
              { key: "Select Category", value: "" },
              { key: "General", value: "general" },
              { key: "Scheduled Caste", value: "sc" },
              { key: "Scheduled Tribe", value: "st" },
              { key: "Economically Weaker Section", value: "ews" },
              { key: "Others", value: "others" },
            ]}
          />
          <Select
            label="Blood Group"
            name="personal_info.blood_group"
            value={formData.personal_info.blood_group}
            onChange={handleChange}
            required
            options={[
              { key: "Select Blood Group", value: "" },
              { key: "A+", value: "A+" },
              { key: "A-", value: "A-" },
              { key: "B+", value: "B+" },
              { key: "B-", value: "B-" },
              { key: "AB+", value: "AB+" },
              { key: "AB-", value: "AB-" },
              { key: "O+", value: "O+" },
              { key: "O-", value: "O-" },
            ]}
          />
        </div>
        <div className="grid-col-2">
          <Aadhar
            label="Aadhar Number"
            name="personal_info.aadhar_number"
            value={formData.personal_info.aadhar_number}
            onChange={handleChange}
            required
          />
          <Pan
            label="PAN Number"
            name="personal_info.pan_number"
            value={formData.personal_info.pan_number}
            onChange={handleChange}
            required
          />
        </div>
        <hr />

        <h3 className="sub-heading">Present Address</h3>
        <AddressComponent
          addressPath="personal_info.present_address"
          formData={formData}
          handleChange={handleChange}
          pincodeError={presentPincodeError}
          setPincodeError={setPresentPincodeError}
          required
        />

        <hr />
        <h3 className="sub-heading">Permanent Address</h3>
        <div>
          <label>
            <input
              type="checkbox"
              name="personal_info.are_addresses_same"
              checked={areAddressesSame}
              onChange={copyAddress}
            />
            Same as Present Address
          </label>
        </div>
        
        {!areAddressesSame && (
          <AddressComponent
            addressPath="personal_info.permanent_address"
            formData={formData}
            handleChange={handleChange}
            pincodeError={permanentPincodeError}
            setPincodeError={setPermanentPincodeError}
          />
        )}

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

export default PersonalInfo;