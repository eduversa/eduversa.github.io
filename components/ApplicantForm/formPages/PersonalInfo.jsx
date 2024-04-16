import React, { useState, useEffect, Fragment, useRef } from "react";
import { AllLoader } from "@/components";
import { updateAppplicantData } from "@/functions";
import {
  Text,
  Name,
  Email,
  Number,
  Select,
  DateInput,
  Pincode,
  Aadhar,
  Pan,
  PhoneNumber,
  FormButtons,
  Dob,
} from "../inputComponent/InputComponent";
import fetchAddressFromPincode from "../inputComponent/fetchAddressFromPincode";

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
  const copyAddress = (e) => {
    const isChecked = e.target.checked;
    setAreAddressesSame(isChecked);

    let updatedFormData;
    if (isChecked) {
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
  const [loading, setLoading] = useState(false);

  const [prevPresentPincode, setPrevPresentPincode] = useState("");
  const [prevPermanentPincode, setPrevPermanentPincode] = useState("");
  
  const [areAddressesSame, setAreAddressesSame] = useState();

  const [fetching, setFetching] = useState(false);
  const controller = useRef(null);

  useEffect(() => {
    if (presentPincode.length === 6 && presentPincode !== prevPresentPincode) {
      if (fetching) {
        controller.current.abort();
      }
      setFetching(true);
      controller.current = new AbortController();
      fetchAddressFromPincode(
        formData,
        handleChange,
        "personal_info.present_address",
        presentPincode,
        setPresentPincodeError,
        controller.current
      ).then(() => {
        setFetching(false);
        setPrevPresentPincode(presentPincode);
      });
    }
  }, [
    presentPincode,
    setPresentPincodeError,
    formData,
    handleChange,
    prevPresentPincode,
    fetching,
  ]);

  useEffect(() => {
    if (
      permanentPincode.length === 6 &&
      permanentPincode !== prevPermanentPincode
    ) {
      if (fetching) {
        controller.current.abort();
      }
      setFetching(true);
      controller.current = new AbortController();
      fetchAddressFromPincode(
        formData,
        handleChange,
        "personal_info.permanent_address",
        permanentPincode,
        setPermanentPincodeError,
        controller.current
      ).then(() => {
        setFetching(false);
        setPrevPermanentPincode(permanentPincode);
      });
    }
  }, [
    permanentPincode,
    setPermanentPincodeError,
    formData,
    handleChange,
    prevPermanentPincode,
    fetching,
  ]);

  useEffect(() => {
    setAreAddressesSame(formData.personal_info.are_addresses_same);
    if (areAddressesSame) {
      const presentAddress = formData.personal_info.present_address;
      const permanentAddress = formData.personal_info.permanent_address;
      
      if (JSON.stringify(presentAddress) !== JSON.stringify(permanentAddress)) {
        const updatedFormData = {
          ...formData,
          personal_info: {
            ...formData.personal_info,
            permanent_address: { ...presentAddress },
          },
        };
        handleChange({ target: { name: "formData", value: updatedFormData } });
      }
    }
  }, [formData, areAddressesSame, handleChange]);

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
        <h3 className="sub-heading">Present Address</h3>
        <Text
          label="Street"
          name="personal_info.present_address.street"
          value={formData.personal_info.present_address.street}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          <Pincode
            label="Pincode"
            name="personal_info.present_address.pincode"
            value={formData.personal_info.present_address.pincode}
            onChange={(e) => {
              handleChange(e);
              setPresentPincode(e.target.value);
            }}
            required
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
        <h3 className="sub-heading">Permanent Address</h3>
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
          <Pincode
            label="Pincode"
            name="personal_info.permanent_address.pincode"
            value={formData.personal_info.permanent_address.pincode}
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
