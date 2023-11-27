import React, { useState, useEffect, Fragment } from "react";
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
} from "../inputComponent/InputComponent";
import fetchAddressFromPincode from "../inputComponent/fetchAddressFromPincode";
import { updateAppplicantData } from "@/functions";

const FamilyInfo = ({
  formData,
  setFormData,
  clearFormData,
  handleChange,
  handlePreviousClick,
  handleNextClick,
  currentStep,
  totalSteps,

  officePincodeError,
  setOfficePincodeError,
}) => {
  const [officePincode, setOfficePincode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (officePincode.length === 6) {
      fetchAddressFromPincode(
        formData,
        handleChange,
        "family_info.guardian.office_address",
        officePincode,
        setOfficePincodeError,
        controller
      );
    }
    return () => {
      controller.abort();
    };
  }, [officePincode, setOfficePincodeError, formData, handleChange]);

  useEffect(() => {
    const savedFamilyInfo = JSON.parse(localStorage.getItem("family_info"));
    if (savedFamilyInfo) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        family_info: savedFamilyInfo,
      }));
    }
  }, [setFormData]);

  async function onSubmitHandler() {
    setLoading(true);
    localStorage.setItem("family_info", JSON.stringify(formData.family_info));
    const data = JSON.stringify(formData.family_info);
    const type = "family";
    const user_id = localStorage.getItem("userid");
    try {
      const response = await updateAppplicantData(user_id, type, data);
      if (process.env.NODE_ENV === "development") {
        const response = await updateAppplicantData(user_id, type, data);
        console.log(response);
      }
      alert(response.message);
      setLoading(false);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
    }
  }

  return (
    <Fragment>
      {loading && <AllLoader />}
      <form
        className="page--content"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmitHandler();
          handleNextClick();
        }}
      >
        <h3 className="sub-heading">Father&apos;s Information</h3>
        <Text
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
        <Text
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
        <Text
          label="Full Name"
          name="family_info.guardian.name"
          value={formData.family_info.guardian.name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          <Text
            label="Relation"
            name="family_info.guardian.relation"
            value={formData.family_info.guardian.relation}
            onChange={handleChange}
            required
          />
          <Text
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
          <Text
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
        <div>
          <Text
            label="Street"
            name="family_info.guardian.office_address.street"
            value={formData.family_info.guardian.office_address.street}
            onChange={handleChange}
          />

          <div className="grid-col-2">
            <Pincode
              label="Pincode"
              name="family_info.guardian.office_address.pincode"
              value={formData.family_info.guardian.office_address.pincode}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value.length === 6) {
                  setOfficePincode(e.target.value);
                  setOfficePincodeError(false);
                }
              }}
              className={officePincodeError ? "invalid" : ""}
            />
            <Text
              label="City"
              name="family_info.guardian.office_address.city"
              value={formData.family_info.guardian.office_address.city}
              onChange={handleChange}
            />
          </div>

          <div className="grid-col-2">
            <Text
              label="District"
              name="family_info.guardian.office_address.district"
              value={formData.family_info.guardian.office_address.district}
              onChange={handleChange}
            />
            <Text
              label="State"
              name="family_info.guardian.office_address.state"
              value={formData.family_info.guardian.office_address.state}
              onChange={handleChange}
            />
          </div>
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

export default FamilyInfo;
