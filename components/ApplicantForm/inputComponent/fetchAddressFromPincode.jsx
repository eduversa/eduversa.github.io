const fetchAddressFromPincode = async (
  formData,
  handleChange,
  addressType,
  pincode,
  setPincodeError,
  controller
) => {
  // console.log("fetchAddressFromPincode called");
  if (pincode.length !== 6) {
    return;
  }

  const signal = controller.signal;

  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
      { signal }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log("API response", data);
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

        // Update the nested fields directly in the formData object
        let updatedFormData = { ...formData };
        let currentLevel = updatedFormData;
        const addressTypeKeys = addressType.split(".");
        for (let i = 0; i < addressTypeKeys.length; i++) {
          if (i === addressTypeKeys.length - 1) {
            currentLevel[addressTypeKeys[i]] = {
              ...currentLevel[addressTypeKeys[i]],
              street: street,
              city: postOffice.Region !== "NA" ? postOffice.Region : "",
              district: postOffice.District !== "NA" ? postOffice.District : "",
              state: postOffice.State !== "NA" ? postOffice.State : "",
            };
          } else {
            currentLevel[addressTypeKeys[i]] = {
              ...currentLevel[addressTypeKeys[i]],
            };
            currentLevel = currentLevel[addressTypeKeys[i]];
          }
        }
        // console.log(updatedFormData)
        // Call handleChange to update the entire formData
        handleChange({ target: { name: "formData", value: updatedFormData } });
        setPincodeError(false);
      }
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Fetch request cancelled");
    } else {
      console.error("Error fetching address details:", error);
      setPincodeError(true);
    }
  }
};

export default fetchAddressFromPincode;
