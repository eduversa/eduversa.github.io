// Function to handle API requests
export async function apiRequest(endpoint, method, body = {}) {
  try {
    const response = await fetch(
      `https://eduversa-api.onrender.com${endpoint}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return {
      success: response.ok,
      status: data.status,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Network or unexpected error:", error);
    throw new Error("An unexpected error occurred.");
  }
}

// Higher-order function to handle loading states and log route information
export function withLoading(asyncFunction, setLoading, routeName = "") {
  return async (...args) => {
    if (process.env.NODE_ENV === "development") {
      devLog(`${routeName} route accessed`, args);
    }

    setLoading(true);
    try {
      const result = await asyncFunction(...args);

      // Log the response data in development mode
      if (process.env.NODE_ENV === "development") {
        devLog(`Response from ${routeName} route`, result);
      }

      return result;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        devLog(`Error in ${routeName} route`, error.message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
}

// Function to display alerts
export function showAlert(message) {
  alert(message);
}

// Function for logging in development mode
export function devLog(message, data) {
  if (process.env.NODE_ENV === "development") {
    console.log(message, data);
  }
}
