// Function to handle API requests
export async function apiRequest(endpoint, method, body = {}, authToken = "") {
  try {
    let requestBody;

    // Construct the request body based on the endpoint
    if (endpoint === "/account/auth" && method === "PUT") {
      // Login request
      requestBody = JSON.stringify({
        user_id: body.username, // Assuming body contains 'username' for login
        password: body.password,
      });
    } else if (endpoint === "/account/register" && method === "POST") {
      // Register request
      requestBody = JSON.stringify({ email: body.email }); // Assuming body contains 'email' for registration
    } else {
      // Default case for other endpoints
      requestBody = JSON.stringify(body);
    }

    const response = await fetch(
      `https://eduversa-api.onrender.com${endpoint}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: method !== "GET" ? requestBody : null,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Improved error handling for specific status codes
      const errorMessage =
        data.message || "An error occurred while processing your request.";
      throw new Error(errorMessage);
    }

    // Structured success response
    return {
      success: true,
      status: data.status,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    devLog("Network or unexpected error:", error.message || error);
    return {
      success: false,
      status: false,
      message: error.message || "An unexpected error occurred.",
      data: null,
    };
  }
}

// Higher-order function to handle loading states, logging, and error alerts
export function withLoading(
  asyncFunction,
  setLoading,
  showAlert,
  routeName = ""
) {
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

      // Handle alert on success/failure of request
      if (!result.success || result.status === false) {
        showAlert(result.message || "Request failed. Please try again.");
      }

      return result;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        devLog(`Error in ${routeName} route`, error.message);
      }
      showAlert(
        error.message || "An unexpected error occurred. Please try again."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };
}

// Function to log data in development mode only
export function devLog(message, data = "") {
  if (process.env.NODE_ENV === "development") {
    console.log(message, data);
  }
}
