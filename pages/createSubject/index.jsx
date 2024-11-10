import SubjectList from "@/components/AdminForms/SubjectForms/SubjectList";
import SubjectForm from "@/components/AdminForms/SubjectForms/subjectForm";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getCollegeDetailsApi } from "@/functions";
export default function Subject() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [totalSubjects, setTotalSubjects] = useState([]);
  const [collegeDetails,setCollegeDetails] = useState();
  const getSubjects = async () => {
      try {
        const res = await getCollegeDetailsApi(304);
        console.log(res);
        setCollegeDetails(res);
      }
      catch(err) {
        console.error(err);
      }
    }
  useEffect(()=> {
      getSubjects();
  },[])

  const handleSubmit = async (data) => {
    try {
      setIsFormVisible(false);
      setTotalSubjects([...totalSubjects,{
        ...data
      }])
      
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onCancel = () => {
    setIsFormVisible(false);

  }
  return (
    <>
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
                {!isFormVisible && (
                  <button
                    onClick={() => setIsFormVisible(true)}
                    className="button button--primary button--icon"
                  >
                    <PlusCircle size={16} />
                    Add New Subject
                  </button>
                )}
              </header>
              {isFormVisible ? (
                <SubjectForm onSubmit={handleSubmit} onCancel={onCancel} dropDownData = {collegeDetails}/>
              ) : (
                <SubjectList totalSubjects={totalSubjects} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
