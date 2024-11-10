import FormField from "@/components/FormField";
import { GitBranch, Library, Type,BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function SubjectForm({ onSubmit, onCancel, dropDownData}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      course: "",
      stream: "",
      type: "",
    },
  });
  const selectedCourse = watch("course");
  const [courses,setCourses] = useState(dropDownData.data.college_courses);
  const [streams, setStreams] = useState([]);

  useEffect(() => { 
    const selectedCourseName = courses.find((c) => c.name === selectedCourse);

    setStreams(selectedCourseName?.streams || []);

    setValue('stream',"")
  },[selectedCourse,setValue,courses])

  return (
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <div className="form-container">
                <h3 className="form__title">Add New Subject</h3>

                <FormField
                  label={"Subject"}
                  icon={Library}
                  error={errors.name?.message}
                >
                  <input
                    {...register("name", {
                      required: "Subject name is required",
                      minLength: {
                        value: 2,
                        message: "Atleast 2 character",
                      },
                    })}
                    className="form__input"
                    placeholder="e.g., Data Structures and Algorithms"
                  />
                </FormField>
                {/* <FormField
                  label="Course"
                  icon={BookOpen}
                  error={errors.course?.message}
                >
                  <input
                    {...register("course", {
                      required: "Course is required",
                    })}
                    className="form__input"
                    placeholder="e.g., BTech/BCA"
                  />
                </FormField> */}
                    
                    <div className="form__group">
                    <label className="form__label">
                    <BookOpen size={16} />
                      Course
                      </label>

                      <select {...register("course",{
                        required : "Course is required" 
                      })}  >
                        <option value="" disabled selected hidden>Select a course</option>
                        {courses.map((c,i) =>(
                          <option key={i} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.course?.message && <p className="form__error">{errors.course.message}</p>}
                    </div>

                    <div className="form__group">
                    <label className="form__label">
                    <BookOpen size={16} />
                      Stream
                      </label>

                      <select {...register("stream",
                        streams.length>0? 
                      {
                        required : "Stream is required" 
                      } : {}
                      
                      )}  disabled={!streams.length}>
                        <option value="" disabled selected hidden>Select a stream</option>
                        {streams.map((c,i) =>(
                          <option key={i} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.stream?.message && <p className="form__error">{errors.stream.message}</p>}
                    </div>

                {/* <FormField
                  label="Stream"
                  icon={GitBranch}
                  error={errors.stream?.message}
                >
                  <input
                    {...register("stream", {
                      required: "Stream is required",
                    })}
                    className="form__input"
                    placeholder="e.g., Computer Science and Technology"
                  />
                </FormField> */}

                    <FormField label={"Subject Type"} icon={Type} error={errors.type?.message}>
                        <input {...register("type",{
                            required : "Type of subject is required",
                        })}
                        className="form__input" placeholder="Theory/Sessional"
                        />
                    </FormField>
                    <div className="form__actions">
                        <button type="submit" disabled={isSubmitting} className="button button--primary button--icon">
                            Create Subject
                        </button>

                        {onCancel && (
                            <button type="button" onClick={onCancel} className="button button--secondary">
                                Cancel
                            </button>
                        )}
                    </div>
              </div>
            </form>
         
  );
}
