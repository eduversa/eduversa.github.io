const BASE_URL = "https://eduversa-api.onrender.com";

const getCollegeDetailsApi = async (collegeId) => {
  const url = `${BASE_URL}/college/?college_id=${collegeId}`;
  console.log("URL:", url);

  try {
    console.log("Get College Details Function Called");
    console.log("College ID:", collegeId);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(
        `Get College Details request failed with status ${response.status}`
      );
    }

    console.log("Response:", response);
    const data = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Get College Details request error:", error.message);
    throw error;
  }
};

export default getCollegeDetailsApi;
