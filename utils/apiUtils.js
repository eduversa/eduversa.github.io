// Function to handle API requests
export async function apiRequest(
  endpoint,
  method,
  body = {},
  authToken = "",
  routeName
) {
  try {
    let requestBody;
    // Construct request body based on routeName
    switch (routeName) {
      case "Registration":
        requestBody = JSON.stringify({ email: body.email });
        break;
      case "login":
        requestBody = JSON.stringify({
          user_id: body.user_id,
          password: body.password,
        });
        break;
      case "logout":
        requestBody = null;
        break;
      case "GetSingleApplicant":
        requestBody = null;
        break;
      case "GetAllApplicants":
        requestBody = null;
        break;
      default:
        requestBody = method !== "GET" ? JSON.stringify(body) : null;
    }

    const headers = {
      "Content-Type": "application/json",
      authorization: authToken,
    };

    if (isDevelopment()) {
      devLog(`API Request - ${method} ${endpoint}`, {
        headers,
        body: requestBody,
      });
    }

    const response = await fetch(
      `https://eduversa-api.onrender.com${endpoint}`,
      {
        method,
        headers,
        body: requestBody,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Error occurred while processing your request."
      );
    }

    if (isDevelopment()) {
      devLog(`API Response - ${method} ${endpoint}`, data);
    }

    return {
      success: true,
      status: data.status,
      message: data.message,
      data: data,
    };
  } catch (error) {
    if (isDevelopment()) {
      devLog("Network or unexpected error:", error.message || error);
    }
    return {
      success: false,
      status: false,
      message: error.message || "An unexpected error occurred.",
      data: null,
    };
  }
}

// Higher-order function to handle loading and alerts
export function withLoading(
  asyncFunction,
  setLoading,
  showAlert,
  routeName = ""
) {
  return async (...args) => {
    if (isDevelopment()) {
      devLog(`${routeName} route accessed`, args);
    }

    setLoading(true);
    try {
      const result = await asyncFunction(...args);

      if (isDevelopment()) {
        devLog(`Response from ${routeName} route`, result);
      }

      if (!result.success) {
        showAlert(result.message || "Request failed. Please try again.");
      }

      return result;
    } catch (error) {
      if (isDevelopment()) {
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

// Helper to check development environment
function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

// Logging function for development mode
export function devLog(message, data = "") {
  if (isDevelopment()) {
    console.log(message, data);
  }
}
