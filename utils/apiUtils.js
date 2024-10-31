// Function to handle API requests
export async function apiRequest(
  endpoint,
  method,
  body = {},
  authToken = "",
  routeName
) {
  console.log(endpoint, method, body, authToken, routeName);
  try {
    let requestBody;

    // Determine the request body based on the endpoint
    if (routeName === "Registration") {
      // Register route
      requestBody = JSON.stringify({ email: body.email });
    } else if (routeName === "login") {
      // Login route
      requestBody = JSON.stringify({
        user_id: body.user_id,
        password: body.password,
      });
    } else if (routeName === "logout") {
      // Logout route
      requestBody = null;
    } else {
      requestBody = method !== "GET" ? JSON.stringify(body) : null;
    }

    const response = await fetch(
      `https://eduversa-api.onrender.com${endpoint}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: requestBody,
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
