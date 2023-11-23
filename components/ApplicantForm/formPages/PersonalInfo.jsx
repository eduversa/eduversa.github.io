import React, { useState, useEffect, Fragment } from "react";
import { updateAppplicantData } from "@/functions";
import {
  Text,
  Email,
  Number,
  Select,
  DateInput,
  Pincode,
  Aadhar,
  Pan,
  PhoneNumber,
  FormButtons,
} from "../inputComponent/InputComponent";
import fetchAddressFromPincode from "../inputComponent/fetchAddressFromPincode";

const PersonalInfo = ({
  formData,
  setFormData,
  handleChange,
  handlePreviousClick,
  handleNextClick,
  currentStep,
  totalSteps,

  presentPincodeError,
  setPresentPincodeError,
  permanentPincodeError,
  setPermanentPincodeError,
}) => {
  const copyAddress = (e) => {
    const isChecked = e.target.checked;

    let updatedFormData;
    if (isChecked) {
      // Copy present address to permanent address
      const presentAddress = formData.personal_info.present_address;
      updatedFormData = {
        ...formData,
        personal_info: {
          ...formData.personal_info,
          permanent_address: { ...presentAddress },
          are_addresses_same: true,
        },
      };
    } else {
      // Clear the permanent address fields
      updatedFormData = {
        ...formData,
        personal_info: {
          ...formData.personal_info,
          permanent_address: {
            street: "",
            pincode: "",
            city: "",
            district: "",
            state: "",
          },
          are_addresses_same: false,
        },
      };
    }
    handleChange({ target: { name: "formData", value: updatedFormData } });
  };

  const [presentPincode, setPresentPincode] = useState("");
  const [permanentPincode, setPermanentPincode] = useState("");

  // const [presentPincodeError, setPresentPincodeError] = useState(false);
  // const [permanentPincodeError, setPermanentPincodeError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (presentPincode.length === 6) {
      fetchAddressFromPincode(
        formData,
        handleChange,
        "personal_info.present_address",
        presentPincode,
        setPresentPincodeError,
        controller
      );
    }
    return () => {
      controller.abort();
    };
  }, [presentPincode, setPresentPincodeError, formData, handleChange]);

  useEffect(() => {
    const controller = new AbortController();
    if (permanentPincode.length === 6) {
      fetchAddressFromPincode(
        formData,
        handleChange,
        "personal_info.permanent_address",
        permanentPincode,
        setPermanentPincodeError,
        controller
      );
    }
    return () => {
      controller.abort();
    };
  }, [permanentPincode, setPermanentPincodeError, formData, handleChange]);

  useEffect(() => {
    const savedPersonalInfo = JSON.parse(localStorage.getItem("personal_info"));
    if (savedPersonalInfo) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        personal_info: savedPersonalInfo,
      }));
    }
  }, [setFormData]);

  async function onSubmitHandler() {
    localStorage.setItem(
      "personal_info",
      JSON.stringify(formData.personal_info)
    );
    // const data = localStorage.getItem("personal_info");
    const data = JSON.stringify(formData.personal_info);
    const type = "personal";
    const user_id = localStorage.getItem("userid");
    try {
      const response = await updateAppplicantData(user_id, type, data);
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
        {/* name */}
        <Text
          label="Full Name"
          name="personal_info.name"
          value={formData.personal_info.name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          {" "}
          {/* email contact */}
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
          {" "}
          {/* gender dob */}
          <Select
            label="Gender"
            name="personal_info.gender"
            value={formData.personal_info.gender}
            onChange={handleChange}
            required
            options={[
              { key: "Select Gender", value: "" },
              { key: "Male", value: "Male" },
              { key: "Female", value: "Female" },
              { key: "Other", value: "Other" },
            ]}
          />
          <DateInput
            label="Date of Birth"
            name="personal_info.dob"
            value={formData.personal_info.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2">
          {" "}
          {/* category blood_group */}
          <Select
            label="Category"
            name="personal_info.category"
            value={formData.personal_info.category}
            onChange={handleChange}
            required
            options={[
              { key: "Select Category", value: "" },
              { key: "General", value: "GN" },
              { key: "Scheduled Caste", value: "SC" },
              { key: "Scheduled Tribe", value: "ST" },
              { key: "Other Backward Classes", value: "OBC" },
              { key: "Economically Weaker Section", value: "EWS" },
              { key: "Other", value: "Other" },
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
          {" "}
          {/* aadhar pan */}
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
            minLength="10"
            maxLength="10"
          />
        </div>
        <hr />
        <h3 className="sub-heading">Present Address</h3> {/* present address */}
        <Text
          label="Street"
          name="personal_info.present_address.street"
          value={formData.personal_info.present_address.street}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          {" "}
          {/* pin city */}
          <Pincode
            label="Pincode"
            name="personal_info.present_address.pincode"
            value={formData.personal_info.present_address.pincode}
            // onChange={handleChange}
            onChange={(e) => {
              handleChange(e);
              setPresentPincode(e.target.value);
            }}
            required
            // className={presentPincodeError ? "invalid" : ""}
            // data-isvalid={presentPincodeError ? "false" : "true"}
            // ref={input => input && input.setCustomValidity(presentPincodeError ? 'Invalid pincode' : '')}
            className={presentPincodeError ? "invalid" : ""}
          />
          <Text
            label="City"
            name="personal_info.present_address.city"
            value={formData.personal_info.present_address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2">
          {" "}
          {/* district state */}
          <Text
            label="District"
            name="personal_info.present_address.district"
            value={formData.personal_info.present_address.district}
            onChange={handleChange}
            required
          />
          <Text
            label="State"
            name="personal_info.present_address.state"
            value={formData.personal_info.present_address.state}
            onChange={handleChange}
            required
          />
        </div>
        <hr />
        <h3 className="sub-heading">Permanent Address</h3>{" "}
        {/* permanent address */}
        {/* is permanent address same as present address */}
        <div>
          <label>
            <input
              type="checkbox"
              name="personal_info.are_addresses_same"
              checked={formData.personal_info.are_addresses_same}
              onChange={copyAddress}
            />
            Same as Present Address
          </label>
        </div>
        <Text
          label="Street"
          name="personal_info.permanent_address.street"
          value={formData.personal_info.permanent_address.street}
          onChange={handleChange}
        />
        <div className="grid-col-2">
          {" "}
          {/* pin city */}
          <Pincode
            label="Pincode"
            name="personal_info.permanent_address.pincode"
            value={formData.personal_info.permanent_address.pincode}
            // onChange={handleChange}
            onChange={(e) => {
              handleChange(e);
              setPermanentPincode(e.target.value);
            }}
            className={permanentPincodeError ? "invalid" : ""}
          />
          <Text
            label="City"
            name="personal_info.permanent_address.city"
            value={formData.personal_info.permanent_address.city}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-2">
          {" "}
          {/* district state */}
          <Text
            label="District"
            name="personal_info.permanent_address.district"
            value={formData.personal_info.permanent_address.district}
            onChange={handleChange}
          />
          <Text
            label="State"
            name="personal_info.permanent_address.state"
            value={formData.personal_info.permanent_address.state}
            onChange={handleChange}
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

export default PersonalInfo;
