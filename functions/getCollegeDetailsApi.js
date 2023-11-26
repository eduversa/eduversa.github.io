const BASE_URL = "https://eduversa-api.onrender.com";

const getCollegeDetailsApi = async (collegeId) => {
  const url = `${BASE_URL}/college/?college_id=${collegeId}`;
  if (process.env.NODE_ENV === "development") {
    console.log("URL:", url);
  }

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("College ID:", collegeId);
      console.log("Get College Details Function Called");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
      throw new Error(
        `Get College Details request failed with status ${response.status}`
      );
    }
    if (process.env.NODE_ENV === "development") {
      console.log("Response:", response);
    }
    const data = await response.json();
    if (process.env.NODE_ENV === "development") {
      console.log("Data:", data);
    }
    return data;
  } catch (error) {
    console.error("Get College Details request error:", error.message);
    throw error;
  }
};

export default getCollegeDetailsApi;
