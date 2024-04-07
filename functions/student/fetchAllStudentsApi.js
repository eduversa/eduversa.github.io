const BASE_URL = "https://eduversa-api.onrender.com";

const getAllStudentsApi = async () => {
  const url = `${BASE_URL}/student/find/all`;
  if (process.env.NODE_ENV === "development") {
    console.log("URL:", url);
  }
  const authToken = localStorage.getItem("authToken");
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Get All Students Function Called");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
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
    if (process.env.NODE_ENV === "development") {
      console.error("Get All Students request error:", error.message);
    }
    throw error;
  }
};

export default getAllStudentsApi;
