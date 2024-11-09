import { Fragment, useEffect, useState, useRef } from "react";
import { FacultyLayout } from "@/layout";
import { AllLoader } from "@/components";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { useAlert } from "@/contexts/AlertContext";
import { useRouter } from "next/router";

function Faculty() {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const effectRun = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const facultyId = localStorage.getItem("userid");
    const authToken = localStorage.getItem("authToken");

    if (effectRun.current) return;
    effectRun.current = true;

    const redirectToHome = () => {
      localStorage.clear();
      router.push("/");
    };
    const fetchFacultyData = async () => {
      const wrappedApiRequest = withLoading(
        apiRequest,
        setLoading,
        showAlert,
        "GetSinglefaculty"
      );
      try {
        const response = await wrappedApiRequest(
          `/faculty/?user_id=${facultyId}`,
          "GET",
          null,
          authToken,
          "GetSinglefaculty"
        );
        if (!response?.success || !response?.status) {
          devLog("Error in fetching single faculty data:", response);
          showAlert(response?.message || "Failed to fetch faculty data");
          redirectToHome();
          setFacultyData(response.data.data);
          return;
        }
      } catch (error) {
        devLog("Error in fetching single faculty data:", error);
        showAlert(error.message || "Failed to fetch faculty data");
        redirectToHome();
      }
    };

    fetchFacultyData();
  }, [router, showAlert]);

  return (
    <Fragment>
      {loading && <AllLoader />}
      <FacultyLayout>
        <h1>Faculty Dashboard</h1>
      </FacultyLayout>
    </Fragment>
  );
}

export default Faculty;
