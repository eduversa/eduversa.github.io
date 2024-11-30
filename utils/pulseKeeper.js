import { useEffect } from "react";

const PulseKeeper = () => {
  const apiURL = "https://eduversa-api.onrender.com";

  const keepApiAlive = async () => {
    try {
      const response = await fetch(apiURL);
      if (response.status === 200) {
        console.log("API is active: Welcome To Eduversa");
      } else {
        console.log("API is Down");
      }
    } catch (error) {
      console.error("Error while pinging API:", error);
      console.log("API is Down");
    }
  };

  useEffect(() => {
    keepApiAlive();
    const interval = setInterval(keepApiAlive, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default PulseKeeper;
