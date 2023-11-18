// utils/fetchAddressFromPincode.js

// const fetchAddressFromPincode = async ( formData, handleChange, addressType, pincode, setPincodeError ) => {
//   if (pincode.length !== 6) {
//     return;
//   }

//   try {
//     const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//     if (response.ok) {
//       const data = await response.json();
//       if (data && data.length > 0 && data[0].PostOffice.length > 0) {
//         const postOffice = data[0].PostOffice[0];
//         // const street = [postOffice.Name, postOffice.Division, postOffice.Region, postOffice.Block]
//         //   .filter(value => Boolean(value) && value !== "NA")
//         //   .join(", ");
//         const updatedFormData = {
//           ...formData,
//           [addressType]: {
//             ...formData[addressType],
//             // street: street,
//             city: postOffice.Region !== "NA" ? postOffice.Region : "",
//             district: postOffice.District !== "NA" ? postOffice.District : "",
//             state: postOffice.State !== "NA" ? postOffice.State : "",
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

const fetchAddressFromPincode = async (
  formData,
  handleChange,
  addressType,
  pincode,
  setPincodeError
) => {
  console.log("fetchAddressFromPincode called");
  if (pincode.length !== 6) {
    return;
  }

  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    if (response.ok) {
      const data = await response.json();
      console.log("API response", data);
      if (data && data.length > 0 && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const street = [
          postOffice.Name,
          postOffice.Division,
          postOffice.Region,
          postOffice.Block,
        ]
          .filter((value) => Boolean(value) && value !== "NA")
          .join(", ");
        let nestedObj = { ...formData };
        const addressTypeKeys = addressType.split(".");
        for (let key of addressTypeKeys) {
          nestedObj = nestedObj[key];
        }

        // Update the nested fields
        nestedObj = {
          ...nestedObj,
          street: street,
          city: postOffice.Region !== "NA" ? postOffice.Region : "",
          district: postOffice.District !== "NA" ? postOffice.District : "",
          state: postOffice.State !== "NA" ? postOffice.State : "",
        };

        // Reconstruct the formData with updated nested fields
        let updatedFormData = { ...formData };
        let temp = updatedFormData;
        for (let key of addressTypeKeys.slice(0, -1)) {
          temp[key] = { ...temp[key] };
          temp = temp[key];
        }
        temp[addressTypeKeys[addressTypeKeys.length - 1]] = nestedObj;

        // Call handleChange to update the entire formData
        handleChange({ target: { name: "formData", value: updatedFormData } });
        setPincodeError(false);
      }
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching address details:", error);
    setPincodeError(true);
  }
};

export default fetchAddressFromPincode;
