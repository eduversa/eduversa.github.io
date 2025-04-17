import CourseForm from "@/components/AdminForms/Course/CourseForm";

import { Fragment, useState } from "react";
import { useAlert } from "@/contexts/AlertContext";
import { devLog } from "@/utils/apiUtils";
import { PlusCircle } from "lucide-react";
import CourseList from "@/components/AdminForms/Course/CourseList";
import { Navbar } from "@/containers";

// export default function CreateCourse() {
//     const {showAlert} = useAlert();
//     const [isFormVisible,setIsFormVisible] = useState(false);
//     const [courses,setCoureses] = useState([]);
//     const [id,setId] = useState(1);
//     const [isEditing,setIsEditing] = useState(false);
//     const [currentData,setCurrentData] = useState(null);
    
//     const handleSubmit = (data) => {
//         if(isEditing) {
//             setCoureses(courses.map((c) =>
//                 c._id === data._id ? {...data}  : c
//             ))
//         }
//         else {
//             setCoureses([...courses,{...data,_id : id}])
//             setId(i => i+1);
//         }
//         showAlert("Task completed");
//         setIsFormVisible(false);
//     }

//       const onCancel = () => {
//     setIsFormVisible(false);
//   };

//    const onDelete = (id) => {
//     /* api request */
//     setCoureses(courses.filter((item) => (item._id !== id)))
//     showAlert("Task completed")
//   }
    
//     const onEdit = (courseData) => {
//     setIsEditing(true);
//     setIsFormVisible(true);
//     setCurrentData(courseData);
//     devLog("room data is", courseData);
//   }

//     return (
//          <div className="container">
//         <div className="content">
//           <div className="card">
//             <div className="card__body">
//               <header className="header">
//                 <div>
//                   <h1 className="header__title">Course Management</h1>
//                   <p className="header__subtitle">Manage all the courses</p>
//                 </div>
//                 <button
//                   onClick={() => setIsFormVisible(true)}
//                   className="button button--primary button--icon"
//                 >
//                   <PlusCircle size={16} />
//                   Add new course
//                 </button>
//               </header>
//               {isFormVisible ? (
//                      <CourseForm onSubmit={handleSubmit} onCancel = {onCancel} currentData = {currentData}/>
//               ) : (
//                 <CourseList courses= {courses} onDelete={onDelete} onEdit={onEdit}/>
//               )}
       
//         </div>
//         </div>
//         </div>
//         </div>
//     )
// }

export default function CreateCourse() {
    const { showAlert } = useAlert();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [courses, setCourses] = useState([]);
    const [id, setId] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [currentData, setCurrentData] = useState(null);

    const handleSubmit = (data) => {
        if (isEditing) {
            setCourses(courses.map((c) =>
                c._id === data._id ? { ...data } : c
            ));
        } else {
            setCourses([...courses, { ...data, _id: id }]);
            setId((i) => i + 1);
        }
        showAlert("Task completed");
        setIsFormVisible(false);
        setIsEditing(false);         // Reset editing state after submit
        setCurrentData(null);        // Clear currentData to reset the form
    };

    const onCancel = () => {
        setIsFormVisible(false);
        setIsEditing(false);         // Reset editing state on cancel
        setCurrentData(null);        // Clear currentData on cancel
    };

    const onDelete = (id) => {
        setCourses(courses.filter((item) => item._id !== id));
        showAlert("Task completed");
    };

    const onEdit = (courseData) => {
        setIsEditing(true);
        setIsFormVisible(true);
        setCurrentData(courseData);
        devLog("course data is", courseData);
    };

    return (
        <Fragment>
            <Navbar />
            <div className="container">
                <div className="content">
                    <div className="card">
                        <div className="card__body">
                            <header className="header">
                                <div>
                                    <h1 className="header__title">Course Management</h1>
                                    <p className="header__subtitle">Manage all the courses</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsFormVisible(true);
                                        setIsEditing(false); // Ensure form opens in create mode
                                        setCurrentData(null); // Clear current data for fresh form
                                    }}
                                    className="button button--primary button--icon"
                                >
                                    <PlusCircle size={16} />
                                    Add new course
                                </button>
                            </header>
                            {isFormVisible ? (
                                <CourseForm
                                    onSubmit={handleSubmit}
                                    onCancel={onCancel}
                                    currentData={currentData}
                                />
                            ) : (
                                <CourseList
                                    courses={courses}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
