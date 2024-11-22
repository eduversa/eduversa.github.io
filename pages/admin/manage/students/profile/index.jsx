import { AdminLayout } from '@/layout';
import Image from 'next/image';
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAlert } from "@/contexts/AlertContext";
import { apiRequest, devLog, withLoading } from "@/utils/apiUtils";
import { AllLoader } from '@/components';

function formatDate(date) {
  return date.toLocaleString('en-US', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    timeZoneName: 'short' 
  });
}

function formatDOB(date) {
  return date.toLocaleString('en-US', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
  });
}

const formatLabel = (key) => {
  if (!key) return '';
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2') 
    .replace(/_/g, ' ') 
    .replace(/\b\w/g, (char) => char.toUpperCase()); 
};

const fieldsToIgnore = [
  "middle_name",
  "last_name",
  "_id",
  "subjectString",
  "subjects",
  "are_addresses_same",
  "is_completely_filled"
]

const ignoreFields = (key) => {
  return fieldsToIgnore.includes(key)
}

const reorderField = (userData) => {
  const { image, user_id, personal_info, family_info, academic_info, course_info, createdAt, updatedAt } = userData;
  return {
    image: image,
    user_id: user_id,
    personal_info: {
      first_name: personal_info.first_name,
      middle_name: personal_info.middle_name,
      last_name: personal_info.last_name,
      gender: personal_info.gender,
      dob: personal_info.dob,
      email: personal_info.email,
      contact: personal_info.contact,
      category: personal_info.category,
      blood_group: personal_info.blood_group,
      aadhar_number: personal_info.aadhar_number,
      pan_number: personal_info.pan_number,
      // are_addresses_same: personal_info.are_addresses_same,
      // present_address: personal_info.present_address,
      // permanent_address: personal_info.permanent_address,
      ...personal_info,
    },
    family_info: {
      father: family_info.father,
      mother: family_info.mother,
      guardian: {
        first_name: family_info.guardian.first_name,
        middle_name: family_info.guardian.middle_name,
        last_name: family_info.guardian.last_name,
        relation: family_info.guardian.relation,
        contact: family_info.guardian.contact,
        email: family_info.guardian.email,
        pan_number: family_info.guardian.pan_number,
        aadhar_number: family_info.guardian.aadhar_number,
        occupation: family_info.guardian.occupation,
        designation: family_info.guardian.designation,
        income: family_info.guardian.income,
        office_contact: family_info.guardian.office_contact,
        office_address: family_info.guardian.office_address,
      },
      _id: family_info._id,
    },
    academic_info: academic_info,
    course_info: course_info,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };
};

const RenderSection = ({ data, sectionLabel }) => {
  return (
    <section>
      <h2>{formatLabel(sectionLabel)}</h2>

      {Object.keys(data).map((key) => {
        const value = data[key];

        if (ignoreFields(key)) {
          return
        }
        if (key === 'image') {
          return (
            <div key={key} className='profile-image-container'>
              <Image src={value} alt="Profile Image" width={200} height={200} />
            </div>
          );
        }

        if (key === 'createdAt' || key === 'updatedAt') {
          const formattedDate = formatDate(new Date(value));
          return (
            <div key={key} className='section-item'>
              <strong>{formatLabel(key)}:</strong> {formattedDate}
            </div>
          );
        }
        
        if (key === 'dob'){
          const formattedDate = formatDOB(new Date(value));
          return (
            <div key={key} className='section-item'>
              <strong>Date of Birth:</strong> {formattedDate}
            </div>
          );
        }

        if (key === 'first_name') {
          const fullName = `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`.trim();
          if (fullName) {
            return (
              <div key={key} className='section-item'>
                <strong>{formatLabel('full_name')}:</strong> {fullName}
              </div>
            );
          }
        }

        if (typeof value === 'object' && value !== null) {
          return (
            <div key={key}>
              <RenderSection data={value} sectionLabel={key} />
            </div>
          );
        } else {
          return (
            <div key={key} className='section-item'>
              <strong>{formatLabel(key)}:</strong> {value || 'N/A'}
            </div>
          );
        }
      })}
    </section>
  );
};


function StudentProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    const studentId = localStorage.getItem('selected-studentId');
    const authToken = localStorage.getItem('authToken');

    const fetchStudentData = async () => {
      const wrappedApiRequest = withLoading(apiRequest, setLoading, showAlert, 'GetSingleStudent');
      try {
        const response = await wrappedApiRequest(
          `/student/?user_id=${studentId}`,
          'GET',
          null,
          authToken,
          'GetSingleStudent'
        );

        if (!response.success || !response.status) {
          devLog('Error fetching student data:', response);
          showAlert(response.message || 'Failed to fetch student data');
          router.push('/');
          return;
        }
        const reorderedData = reorderField(response.data.data);

        setUserData(reorderedData);
        localStorage.setItem('student_profile', JSON.stringify(reorderedData));
        // localStorage.setItem('selected_user_type', "student");
      } catch (error) {
        devLog('Error fetching student data:', error);
        showAlert(error.message || 'Failed to fetch student data');
        router.push('/');
      }
    };

    fetchStudentData();
  }, [router, showAlert]);

  if (loading || !userData) {
    return <AllLoader/>
  }

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

  return (
    <Fragment>
      <AdminLayout>
        <div className='student-profile'>
          <RenderSection data={userData} sectionLabel="Student Profile" />
          <div className='button-container'>
            <button onClick={updateHandler}>Update</button>
          </div>
        </div>
      </AdminLayout>
    </Fragment>
  );
}


export default StudentProfile;



/**
image: null,
personal_info: {
  name: "",
  email: "",
  contact: "",
  gender: "",
  dob: "",
  are_addresses_same: false,
  category: "",
  blood_group: "",
  aadhar_number: "",
  pan_number: "",
  present_address: {
    street: "",
    pincode: "",
    city: "",
    district: "",
    state: "",
  },
  permanent_address: {
    street: "",
    pincode: "",
    city: "",
    district: "",
    state: "",
  },
},
family_info: {
  father: {
    name: "",
    email: "",
    contact: "",
  },
  mother: {
    name: "",
    email: "",
    contact: "",
  },
  guardian: {
    name: "",
    relation: "",
    occupation: "",
    designation: "",
    office_contact: "",
    contact: "",
    income: "",
    email: "",
    pan_number: "",
    aadhar_number: "",
    office_address: {
      street: "",
      pincode: "",
      city: "",
      district: "",
      state: "",
    },
  },
},
academic_info: {
  admission: {
    exam_name: "",
    year_of_exam: "",
    roll_number: "",
    rank: "",
  },
  secondary: {
    exam_name: "",
    year_of_exam: "",
    board: "",
    aggregate: "",
    school_name: "",
    marks: {},
  },
  higher_secondary: {
    exam_name: "",
    year_of_exam: "",
    board: "",
    aggregate: "",
    school_name: "",
    marks: {},
  },
},
course_info: {
  course_name: "",
  duration: "",
  stream: "",
  admission_year: "" ,
},


 */