import { Fragment, useEffect, useState } from "react";
import { StudentLayout } from "@/layout";
import { fetchSingleStudent } from "@/functions";
import { AllLoader } from "@/components";
function Index() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "student") {
      const studentId = localStorage.getItem("userid");

      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetchSingleStudent(studentId);

          if (!response || response.error) {
            console.error("Error fetching student data:", response?.error);
            setLoading(false);
            return;
          }

          setProfileData(response);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching student data:", error.message);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <Fragment>
      {loading && <AllLoader />}
      <StudentLayout>{JSON.stringify(profileData)}</StudentLayout>
    </Fragment>
  );
}

export default Index;
