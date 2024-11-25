import { Fragment, useEffect, useRef, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { ApplicantForm } from "@/components";
import { useRouter } from "next/router";
import { useAlert } from "@/contexts/AlertContext";
import { apiRequest, withLoading } from "@/utils/apiUtils";

function UpdateApplicant() {
  const [userid, setUserid] = useState("");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const effectRun = useRef(false);
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    const applicantId = localStorage.getItem("userid");
    setUserid(applicantId);
    const authToken = localStorage.getItem("authToken");
    if (effectRun.current) return;
    effectRun.current = true;

    const fetchSingleApplicantData = async () => {
      const wrappedApiRequest = withLoading(
        apiRequest,
        setLoading,
        showAlert,
        "GetSingleApplicant"
      );
      try {
        const response = await wrappedApiRequest(
          `/applicant/?user_id=${applicantId}`,
          "GET",
          null,
          authToken,
          "GetSingleApplicant"
        );
        if (!response.success || !response.status) {
          devLog("Error in fetching single applicant data:", response);
          showAlert(response.message || "Failed to fetch applicant data");
          localStorage.clear();
          router.push("/");
          return;
        }
        setUserData(response.data.data);
        localStorage.setItem("applicant_profile", JSON.stringify(response.data.data));
        // localStorage.setItem('selected_user_type', "applicant");
      } catch (error) {
        devLog("Error in fetching single applicant data:", error);
        showAlert(error.message || "Failed to fetch applicant data");
        localStorage.clear();
        router.push("/");
      }
    };
    fetchSingleApplicantData();

  }, [router, showAlert]); 

  return (
    <Fragment>
      <ApplicantLayout>
        <ApplicantForm userid={userid} userData={userData} selected_user_type="applicant"/>
      </ApplicantLayout>
    </Fragment>
  );
}

export default UpdateApplicant;
