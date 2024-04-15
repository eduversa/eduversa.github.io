const BASE_URL = "https://eduversa-api.onrender.com";

const deleteSingleStudent = async (userId) => {
  const url = `${BASE_URL}/student/?user_id=${userId}`;
  if (process.env.NODE_ENV === "development") {
    console.log("URL:", url);
    console.log("Deleting Single Student...");
  }
  const authToken = localStorage.getItem("authToken");
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.log("Error:", response);
      }
      throw new Error("Failed to delete single student");
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Student deleted successfully");
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Delete Single Student request error:", error.message);
    }
    throw error;
  }
};

export default deleteSingleStudent;
