// import SubjectList from "@/components/AdminForms/Subject/SubjectList";
// import { PlusCircle } from "lucide-react";
// import { useState, useEffect } from "react";
// import { getCollegeDetailsApi } from "@/functions";
// import SubjectForm from "@/components/AdminForms/Subject/SubjectForm";
// import { devLog } from "@/utils/apiUtils";
// export default function Subject() {
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [editingSubject, setEditingSubject] = useState(null);
//   const [totalSubjects, setTotalSubjects] = useState([]);
//   const [collegeDetails,setCollegeDetails] = useState();
//   const [loading,setLoading] = useState(true);
//   const getSubjects = async () => {
//       try {
//         const res = await getCollegeDetailsApi(304);
//         devLog("data is",res);
//         setLoading(false);
//         setCollegeDetails(res);

//       }
//       catch(err) {
//         console.error(err);
//       }
//     }
//   useEffect(()=> {
//       getSubjects();
//   },[])

//   const handleSubmit = async (data) => {
//     try {
//       setIsFormVisible(false);
//       setTotalSubjects([...totalSubjects,{
//         ...data
//       }])
      
//       devLog("data is",data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const onCancel = () => {
//     setIsFormVisible(false);

//   }

//   if(loading) {
//     return (
//       <p> Loading data </p>
//     )
//   }
//   return (
//     <>
//       <div className="container">
//         <div className="content">
//           <div className="card">
//             <div className="card__body">
//               <header className="header">
//                 <div>
//                   <h1 className="header__title">Subject Management</h1>
//                   <p className="header__subtitle">
//                     Manage all the curriculum subjects
//                   </p>
//                 </div>
//                 {!isFormVisible && (
//                   <button
//                     onClick={() => setIsFormVisible(true)}
//                     className="button button--primary button--icon"
//                   >
//                     <PlusCircle size={16} />
//                     Add New Subject
//                   </button>
//                 )}
//               </header>
//               {isFormVisible ? (
//                 <SubjectForm onSubmit={handleSubmit} onCancel={onCancel} dropDownData = {collegeDetails}/>
//               ) : (
//                 <SubjectList totalSubjects={totalSubjects} />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import SubjectList from "@/components/AdminForms/Subject/SubjectList";
import { AllLoader } from "@/components";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getCollegeDetailsApi } from "@/functions";
import SubjectForm from "@/components/AdminForms/Subject/SubjectForm";
import { useAlert } from "@/contexts/AlertContext";
import { devLog } from "@/utils/apiUtils";

export default function Subject() {
  const {showAlert} = useAlert();
  const [id,setId] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [totalSubjects, setTotalSubjects] = useState([]);
  const [collegeDetails, setCollegeDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const getSubjects = async () => {
    try {
      const res = await getCollegeDetailsApi(304);
      devLog("data is", res);
      setLoading(false);
      setCollegeDetails(res);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubjects();
  }, []);

  const handleSubmit = async (data) => {
    try {
      setIsFormVisible(false);
      if (editingSubject) {
        // Update existing subject
        setTotalSubjects(
          totalSubjects.map((subject) =>
            subject._id === data._id ? { ...data } : subject
          )
        );
      } else {
        // Create new subject
        setTotalSubjects([...totalSubjects, { ...data, _id: id }]);
        setId(i => i+1);
      }
      devLog("Submitted data:", data);
      showAlert("Task completed");
      setEditingSubject(null);
      setIsFormVisible(false);
      setCurrentData(null);

    } catch (err) {
      console.error(err);
    }
  };

  const onCancel = () => {
    setIsFormVisible(false);
    setIsEditing(false);
    setEditingSubject(null); // Clear editing state
  };

  const onEdit = (subject) => {
    setEditingSubject(subject);
    setIsFormVisible(true);
    setIsEditing(true);
  };

  const onDelete = (id) => {
    setTotalSubjects(totalSubjects.filter((subject) => subject._id !== id));
    showAlert("Task completed");
  };

  if (loading) {
    return <AllLoader/>
  }

  return (
    <div className="container">
      <div className="content">
        <div className="card">
          <div className="card__body">
            <header className="header">
              <div>
                <h1 className="header__title">Subject Management</h1>
                <p className="header__subtitle">
                  Manage all the curriculum subjects
                </p>
              </div>
              <button
                onClick={() => {
                  setIsFormVisible(true);
                  setEditingSubject(null); 
                  setIsEditing(false);
                }}
                className="button button--primary button--icon"
              >
                <PlusCircle size={16} />
                Add New Subject
              </button>
            </header>
            {isFormVisible ? (
              <SubjectForm
                onSubmit={handleSubmit}
                onCancel={onCancel}
                currentData={editingSubject} 
                dropDownData={collegeDetails}
              />
            ) : (
              <SubjectList
                totalSubjects={totalSubjects}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
