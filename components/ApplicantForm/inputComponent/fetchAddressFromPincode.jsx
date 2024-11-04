const fetchAddressFromPincode = async (
  formData,
  handleChange,
  addressType,
  pincode,
  setPincodeError,
  controller
) => {
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
      if (process.env.NODE_ENV === "development") {
        console.log(data);
      }
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

        handleChange({
          target: {
            name: `${addressType}.street`,
            value: street,
          },
        });
        handleChange({
          target: {
            name: `${addressType}.city`,
            value: postOffice.Region !== "NA" ? postOffice.Region : "",
          },
        });
        handleChange({
          target: {
            name: `${addressType}.district`,
            value: postOffice.District !== "NA" ? postOffice.District : "",
          },
        });
        handleChange({
          target: {
            name: `${addressType}.state`,
            value: postOffice.State !== "NA" ? postOffice.State : "",
          },
        });

        setPincodeError(false);
      }
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    if (error.name === "AbortError") {
      if (process.env.NODE_ENV === "development") {
        console.log("Fetch request cancelled");
      }
    } else {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching address details:", error);
      }
      setPincodeError(true);
    }
  }
};

export default fetchAddressFromPincode;
