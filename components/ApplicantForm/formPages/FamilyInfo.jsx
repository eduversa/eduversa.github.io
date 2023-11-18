import React, { useState, useEffect } from "react";
import {Text, Email, Number, Select, DateInput, Aadhar, Pan, PhoneNumber, Pincode} from "../inputComponent/InputComponent";
import fetchAddressFromPincode from "../inputComponent/fetchAddressFromPincode";

const FamilyInfo = ({ formData, handleChange, handleSave, handleNextClick, handlePreviousClick, handleSubmit }) => {
  const [officePincode, setOfficePincode] = useState("");
  const [pincodeError, setPincodeError] = useState(false);

  useEffect(() => {
    if (officePincode.length === 6) {
      fetchAddressFromPincode(formData, handleChange, 'family_info.guardian.office_address', officePincode, setPincodeError );
    }
  }, [officePincode]);


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
  //         const street = [postOffice.Name, postOffice.Division, postOffice.Region, postOffice.Block]
  //           .filter(value => Boolean(value) && value !== "NA")
  //           .join(", ");
  //         const updatedFormData = {
  //           ...formData,
  //           family_info: {
  //             ...formData.family_info,
  //             guardian: {
  //               ...formData.family_info.guardian,
  //               office_address: {
  //                 ...formData.family_info.guardian.office_address,
  //                 street: street,
  //                 city: postOffice.Region !== "NA" ? postOffice.Region : "",
  //                 district: postOffice.District !== "NA" ? postOffice.District : "",
  //                 state: postOffice.State !== "NA" ? postOffice.State : "",
  //               },
  //             },
  //           },
  //         };
  //         handleChange({ target: { name: 'formData', value: updatedFormData } });
          
  //         setPincodeError(false);
  //       }
  //     } else {
  //       throw new Error("Failed to fetch data");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching address details:", error);
  //     setPincodeError(true); 
  //   }
  // };
  
  
  return (
    <div className="page">
      <h2 className="page--title">Family Information</h2>
      <form className="page--content" onSubmit={handleNextClick}>
        
        {/* father */}
        <h3 className="sub-heading">Father's Information</h3>
        <Text 
          label="Name"
          name="family_info.father.name"
          value={formData.family_info.father.name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2"> {/* email contact */}
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

        {/* mother */}
        <h3 className="sub-heading">Mother's Information</h3>
        <Text 
          label="Name"
          name="family_info.mother.name"
          value={formData.family_info.mother.name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2"> {/* email contact */}
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

        {/* guardian */}
        <h3 className="sub-heading">Guardian's Information</h3>
        <Text 
          label="Name"
          name="family_info.guardian.name"
          value={formData.family_info.guardian.name}
          onChange={handleChange}
          required
        />
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

          <PhoneNumber
            label="Contact Number"
            name="family_info.guardian.contact"
            value={formData.family_info.guardian.contact}
            onChange={handleChange}
            required
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
        <div className="grid-col-2"> {/* aadhar pan */}
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

        <h4 className="sub-sub-heading">Office Address</h4> {/* office address */}
        <div>
          {/* street */}
          <Text
            label="Street"
            name="family_info.guardian.office_address.street"
            value={formData.family_info.guardian.office_address.street}
            onChange={handleChange}
          />

          <div className="grid-col-2"> {/* pin city */}
            <Pincode
              label="Pincode"
              name="family_info.guardian.office_address.pincode"
              value={formData.family_info.guardian.office_address.pincode}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value.length === 6) {
                  setOfficePincode(e.target.value);
                  setPincodeError(false); 
                }
              }}
              className={pincodeError ? "invalid" : ""}
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
