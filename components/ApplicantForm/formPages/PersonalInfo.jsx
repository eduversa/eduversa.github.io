import React,{useState, useEffect} from "react";
import {Text, Email, Number, Select, DateInput, Pincode, Aadhar, Pan, PhoneNumber} from "../inputComponent/InputComponent";
import fetchAddressFromPincode from "../inputComponent/fetchAddressFromPincode";


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

  const [presentPincode, setPresentPincode] = useState("");
  const [permanentPincode, setPermanentPincode] = useState("");
  
  const [presentPincodeError, setPresentPincodeError] = useState(false);
  const [permanentPincodeError, setPermanentPincodeError] = useState(false);

  useEffect(() => {
    if (presentPincode.length === 6) {
      fetchAddressFromPincode(formData, handleChange, 'personal_info.present_address', presentPincode, setPresentPincodeError);
    }
  }, [presentPincode]);

  useEffect(() => {
    if (permanentPincode.length === 6) {
      fetchAddressFromPincode(formData, handleChange, 'personal_info.permanent_address', permanentPincode, setPermanentPincodeError);
    }
  }, [permanentPincode]);

  // Function to fetch address details(state, district, city) from pincode
  // const fetchAddressFromPincode = async (pincode, addressType) => {
  //   if (pincode.length !== 6) {
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       if (data && data.length > 0 && data[0].PostOffice.length > 0) {
  //         const postOffice = data[0].PostOffice[0];
  //         const street = [
  //           postOffice.Name, 
  //           postOffice.Division, 
  //           postOffice.Region, 
  //           postOffice.Block
  //         ]
  //           .filter(value => Boolean(value) && value !== "NA")
  //           .join(", ");
  //         const updatedFormData = {
  //           ...formData,
  //           personal_info: {
  //             ...formData.personal_info,
  //             [addressType]: {
  //               ...formData.personal_info[addressType],
  //               street: street,
  //               city: postOffice.Region !== "NA" ? postOffice.Region : "",
  //               district: postOffice.District !== "NA" ? postOffice.District : "",
  //               state: postOffice.State !== "NA" ? postOffice.State : "",
  //             },
  //           },
  //         };
  //         handleChange({ target: { name: 'formData', value: updatedFormData } });
  //       }
  //     } else {
  //       throw new Error("Pincode does not exist");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching address details (Pincode does not exist):", error);
  //   }
  // };


  return (
    <div className="page">
      <h2 className="page--title">Personal Information</h2>
      <form className="page--content" onSubmit={handleNextClick}>
        {/* name */}
        <Text   
          label="Name"
          name="personal_info.name"
          value={formData.personal_info.name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2"> {/* email contact */}
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
        <div className="grid-col-2"> {/* pin city */}
          <Pincode
            label="Pincode"
            name="personal_info.present_address.pincode"
            value={formData.personal_info.present_address.pincode}
            // onChange={handleChange}
            onChange={(e) => {
              handleChange(e);
              if (e.target.value.length === 6) {
                setPresentPincode(e.target.value);
              }
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
        
        <hr />

        <h3 className="sub-heading">Permanent Address</h3> {/* permanent address */}
        {/* is permanent address same as present address */}
        <div> 
          <label>
            <input
              type="checkbox"
              name="personal_info.are_addresses_same"
              value={formData.personal_info.are_addresses_same}
              onChange={copyAddress}
            />
            Same as Present Address
          </label>
        </div>
        {/* <Checkbox 
          name="personal_info.are_addresses_same"
          value={formData.personal_info.are_addresses_same}
          onChange={copyAddress}

        /> */}
        <Text
          label="Street"
          name="personal_info.permanent_address.street"
          value={formData.personal_info.permanent_address.street}
          onChange={handleChange}
        />
        <div className="grid-col-2"> {/* pin city */}
          <Pincode
            label="Pincode"
            name="personal_info.permanent_address.pincode"
            value={formData.personal_info.permanent_address.pincode}
            // onChange={handleChange}
            onChange={(e) => {
              handleChange(e);
              if (e.target.value.length === 6) {
                setPermanentPincode(e.target.value);
              }
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
