import React,{useState, useEffect} from "react";
import {Text, Email, Number, Select, DateInput} from "../inputComponent/InputComponent";

const PersonalInfo = ({ formData, handleChange, handleSave, handleNextClick, handlePreviousClick, handleSubmit }) => {
  const copyAddress = (e) => {
    console.log("copyAddress is triggered");
    const isChecked = e.target.checked;
  
    if (isChecked) {
      // Copy present address to permanent address
      const presentAddress = formData.personal_info.present_address;
      const updatedFormData = {
        ...formData,
        personal_info: {
          ...formData.personal_info,
          permanent_address: { ...presentAddress }
        }
      };
      handleChange({ target: { name: 'formData', value: updatedFormData } });
    } else {
      // Clear the permanent address fields
      const updatedFormData = {
        ...formData,
        personal_info: {
          ...formData.personal_info,
          permanent_address: {
            street: '',
            pincode: '',
            city: '',
            district: '',
            state: ''
          }
        }
      };
      handleChange({ target: { name: 'formData', value: updatedFormData } });
    }
  };
  // Function to fetch address details(state, district, city) from pincode
const fetchAddressFromPincode = async (pincode) => {
  if (pincode.length !== 6) {
    return;
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0 && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const street = [postOffice.Name, postOffice.Division, postOffice.Region, postOffice.Block]
          .filter(value => Boolean(value) && value !== "NA")
          .join(", ");
        const updatedFormData = {
          ...formData,
          personal_info: {
            ...formData.personal_info,
            present_address: {
              ...formData.personal_info.present_address,
              street: street,
              city: postOffice.District !== "NA" ? postOffice.District : "",
              district: postOffice.District !== "NA" ? postOffice.District : "",
              state: postOffice.State !== "NA" ? postOffice.State : "",
            },
          },
        };
        handleChange({ target: { name: 'formData', value: updatedFormData } });
      }
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching address details:", error);
  }
};
  const [pincode, setPincode] = useState("");
  useEffect(() => {
    if (pincode.length === 6) {
      fetchAddressFromPincode(pincode);
    }
  }, [pincode]);

  return (
    <div className="page">
      <h2 className="page--title">Personal Information</h2>
      <form className="page--content" onSubmit={handleNextClick}>
        <div className="grid-col-3"> {/* name */}
          <Text
            label="First Name"
            name="personal_info.first_name"
            value={formData.personal_info.first_name}
            onChange={handleChange}
            required
          />

          <Text
            label="Middle Name"
            name="personal_info.middle_name"
            value={formData.personal_info.middle_name}
            onChange={handleChange}
          />

          <Text
            label="Last Name"
            name="personal_info.last_name"
            value={formData.personal_info.last_name}
            onChange={handleChange}
            required
          />          
        </div>
        <div className="grid-col-2"> {/* email contact */}
          <Email
            label="Email"
            name="personal_info.email"
            value={formData.personal_info.email}
            onChange={handleChange}
            required
          />

          <Number
            label="Contact Number"
            name="personal_info.contact"
            value={formData.personal_info.contact}
            onChange={handleChange}
            required
            min="1000000000"
            max="9999999999"
          />          
        </div>
        <div className="grid-col-2"> {/* gender dob */}
          <Select
            label="Gender"
            name="personal_info.gender"
            value={formData.personal_info.gender}
            onChange={handleChange}
            required
            options={[
              {key: "Select Gender", value: ""},
              {key: "Male", value: "Male"},
              {key: "Female", value: "Female"},
              {key: "Other", value: "Other"},
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
        <div className="grid-col-2"> {/* category blood_group */}
          <Select
            label="Category"
            name="personal_info.category"
            value={formData.personal_info.category}
            onChange={handleChange}
            required
            options={[
              {key: "Select Category", value:""},
              {key: "General", value: "GN"},
              {key: "Scheduled Caste", value: "SC"},
              {key: "Scheduled Tribe", value: "ST"},
              {key: "Other Backward Classes", value: "OBC"},
              {key: "Economically Weaker Section", value: "EWS"},
              {key: "Other", value: "Other"},
            ]}
          />

          <Select
            label="Blood Group"
            name="personal_info.blood_group"
            value={formData.personal_info.blood_group}
            onChange={handleChange}
            required
            options={[
              {key: "Select Blood Group", value:""},
              {key: "A+", value:"A+"},
              {key: "A-", value:"A-"},
              {key: "B+", value:"B+"},
              {key: "B-", value:"B-"},
              {key: "AB+", value:"AB+"},
              {key: "AB-", value:"AB-"},
              {key: "O+", value:"O+"},
              {key: "O-", value:"O-"},
            ]}
          />
        </div>
        <div className="grid-col-2"> {/* aadhar pan */}
          <Number 
            label="Aadhar Number"
            name="personal_info.aadhar_number"
            value={formData.personal_info.aadhar_number}
            onChange={handleChange}
            required
            min="100000000000"
            max="999999999999"
          />

          <Text
            label="PAN Number"
            name="personal_info.pan_number"
            value={formData.personal_info.pan_number}
            onChange={handleChange}
            required
            minLength="10"
            maxLength="10"
          />
        </div>

        <h3 className="sub-heading">Present Address</h3> {/* present address */}
        <Text
          label="Street"
          name="personal_info.present_address.street"
          value={formData.personal_info.present_address.street}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2"> {/* pin city */}
          <Number
            label="Pincode"
            name="personal_info.present_address.pincode"
            value={formData.personal_info.present_address.pincode}
            // onChange={handleChange}
            onChange={(e) => {
              handleChange(e);
              if (e.target.value.length === 6) {
                setPincode(e.target.value);
              }
            }}
            required
            min="100000"
            max="999999"
          />

          <Text
            label="City"
            name="personal_info.present_address.city"
            value={formData.personal_info.present_address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid-col-2"> {/* district state */}
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

        <h3 className="sub-heading">Permanent Address</h3> {/* permanent address */}
        <div> {/* is permanent address same as present address */}
          <label>
            <input
              type="checkbox"
              name="sameAddress"
              checked={formData.personal_info.are_addresses_same}
              onChange={copyAddress}
            />{' '}
            Same as Present Address
          </label>
        </div>
        <Text
          label="Street"
          name="personal_info.permanent_address.street"
          value={formData.personal_info.permanent_address.street}
          onChange={handleChange}
        />
        <div className="grid-col-2"> {/* pin city */}
          <Number
            label="Pincode"
            name="personal_info.permanent_address.pincode"
            value={formData.personal_info.permanent_address.pincode}
            onChange={handleChange}
            min="100000"
            max="999999"
          />
          <Text
            label="City"
            name="personal_info.permanent_address.city"
            value={formData.personal_info.permanent_address.city}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-2"> {/* district state */}
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


        <div className="btns"> {/* buttons */}
          <button
            type="button"
            className="btn"
            onClick={handlePreviousClick}
            disabled
            style={{opacity: 0.3}}
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
            className="btn" 
            type="submit" 
          >
            Next
          </button>
          
        </div>

      </form>
    </div>
  );
};

export default PersonalInfo;
