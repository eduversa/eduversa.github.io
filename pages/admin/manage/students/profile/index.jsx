import { AdminLayout } from '@/layout';
import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAlert } from "@/contexts/AlertContext";
import { AllLoader, StudentDashboard } from '@/components';



function StudentProfile() {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [studentId, setStudentId] = useState()
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const storedStudentId = localStorage.getItem("selected-studentId");
    if (storedStudentId) {
      setStudentId(storedStudentId);
    }
    setLoading(false);
  }, []);

  async function updateHandler() {
    try {
      router.push("/admin/manage/students/profile/update");
    } catch (error) {
      console.error("Error updating student:", error);
      showAlert(
        error.message || "Failed to update student, please try again"
      );
    }
  }

  if (loading || !studentId) {
    return <AllLoader/>
  }

  return (
    <Fragment>
      <AdminLayout>
        <div className="student-profile">
          <StudentDashboard studentId={studentId}/>
          <div className='button-container'>
            <button onClick={updateHandler}>Update</button>
          </div>
        </div>
      </AdminLayout>
    </Fragment>
  );
}

export default StudentProfile;


