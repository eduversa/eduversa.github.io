import React from "react";
import {Text, Email, Number, Select, DateInput} from "../inputComponent/InputComponent";

const FamilyInfo = ({ formData, handleChange, handleSave, handleNextClick, handlePreviousClick, handleSubmit }) => {
  return (
    <div className="page">
      <h2 className="page--title">Family Information</h2>
      <form className="page--content" onSubmit={handleNextClick}>
        
        {/* father */}
        <h3 className="sub-heading">Father's Information</h3>
        <div className="grid-col-3"> {/* name */}
          <Text
            label="First Name"
            name="family_info.father.first_name"
            value={formData.family_info.father.first_name}
            onChange={handleChange}
            required
          />

          <Text
            label="Middle Name"
            name="family_info.father.middle_name"
            value={formData.family_info.father.middle_name}
            onChange={handleChange}
          />

          <Text
            label="Last Name"
            name="family_info.father.last_name"
            value={formData.family_info.father.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2"> {/* email contact */}
          <Email
            label="Email"
            name="family_info.father.email"
            value={formData.family_info.father.email}
            onChange={handleChange}
          />

          <Number
            label="Contact Number"
            name="family_info.father.contact"
            value={formData.family_info.father.contact}
            onChange={handleChange}
            min="1000000000"
            max="9999999999"
          />
        </div>

        {/* mother */}
        <h3 className="sub-heading">Mother's Information</h3>
        <div className="grid-col-3"> {/* name */}
          <Text
            label="First Name"
            name="family_info.mother.first_name"
            value={formData.family_info.mother.first_name}
            onChange={handleChange}
            required
          />

          <Text
            label="Middle Name"
            name="family_info.mother.middle_name"
            value={formData.family_info.mother.middle_name}
            onChange={handleChange}
          />

          <Text
            label="Last Name"
            name="family_info.mother.last_name"
            value={formData.family_info.mother.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2"> {/* email contact */}
          <Email
            label="Email"
            name="family_info.mother.email"
            value={formData.family_info.mother.email}
            onChange={handleChange}
          />

          <Number
            label="Contact Number"
            name="family_info.mother.contact"
            value={formData.family_info.mother.contact}
            onChange={handleChange}
            min="1000000000"
            max="9999999999"
          />
        </div>

        {/* guardian */}
        <h3 className="sub-heading">Guardian's Information</h3>
        <div className="grid-col-3"> {/* name */}
          <Text
            label="First Name"
            name="family_info.guardian.first_name"
            value={formData.family_info.guardian.first_name}
            onChange={handleChange}
            required
          />

          <Text
            label="Middle Name"
            name="family_info.guardian.middle_name"
            value={formData.family_info.guardian.middle_name}
            onChange={handleChange}
          />

          <Text
            label="Last Name"
            name="family_info.guardian.last_name"
            value={formData.family_info.guardian.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2"> {/* relation occupation*/}
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
        <div className="grid-col-2"> {/* email contact */}
          <Email
            label="Email"
            name="family_info.guardian.email"
            value={formData.family_info.guardian.email}
            onChange={handleChange}
            required
          />

          <Number
            label="Contact Number"
            name="family_info.guardian.contact"
            value={formData.family_info.guardian.contact}
            onChange={handleChange}
            required
            min="1000000000"
            max="9999999999"
          />
        </div>
        <div className="grid-col-3"> {/* designation office_contact income */}
          <Text
            label="Designation"
            name="family_info.guardian.designation"
            value={formData.family_info.guardian.designation}
            onChange={handleChange}
            required
          />

          <Number
            label="Office Contact"
            name="family_info.guardian.office_contact"
            value={formData.family_info.guardian.office_contact}
            onChange={handleChange}
            required
            min="1000000000"
            max="9999999999"
          />

          <Number
            label="Income"
            name="family_info.guardian.income"
            value={formData.family_info.guardian.income}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2"> {/* pan aadhar */}
          <Text
            label="Pan Number"
            name="family_info.guardian.pan_number"
            value={formData.family_info.guardian.pan_number}
            onChange={handleChange}
            required
            maxLength="10"
            minLength="10"
          />

          <Number
            label="Aadhar Number"
            name="family_info.guardian.aadhar_number"
            value={formData.family_info.guardian.aadhar_number}
            onChange={handleChange}
            required
            min="100000000000"
            max="999999999999"
          />
        </div>

        <h4 className="sub-sub-heading">Office Address:</h4> {/* office address */}
        <div>
          {/* street */}
          <Text
            label="Street"
            name="family_info.guardian.office_address.street"
            value={formData.family_info.guardian.office_address.street}
            onChange={handleChange}
          />

          <div className="grid-col-2"> {/* pin city */}
            <Number
              label="Pincode"
              name="family_info.guardian.office_address.pincode"
              value={formData.family_info.guardian.office_address.pincode}
              onChange={handleChange}
              min="100000"
              max="999999"
            />

            <Text
              label="City"
              name="family_info.guardian.office_address.city"
              value={formData.family_info.guardian.office_address.city}
              onChange={handleChange}
            />
          </div>

          <div className="grid-col-2"> {/* district state */}
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

        <div className="btns"> {/* buttons */}
          <button
            type="button"
            className="btn"
            onClick={handlePreviousClick}
          >
            Prev
          </button>
          <button 
            type="button" 
            className="btn" 
            onClick={handleSave}
          >
            Save
          </button>
          <button 
            type="submit" 
            className="btn"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyInfo;
