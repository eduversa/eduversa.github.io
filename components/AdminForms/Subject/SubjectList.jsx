import { devLog } from "@/utils/apiUtils"
import { Pencil,Trash2 } from "lucide-react"
export default function SubjectList({ totalSubjects,onEdit,onDelete }) {
  devLog("total subjects", totalSubjects)
    if(totalSubjects.length === 0) {
    return(
        <div className="empty-state">
            <p> No subjects added yet </p>
        </div>   
    ) }

    return(
        <div className="subject-list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Stream</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {totalSubjects.map((subject,i) => (
            <tr key={i}>
              <td>{subject.name}</td>
              <td>{subject.course}</td>
              <td>  {subject.stream.length > 0 ? subject.stream : "doesn't exist"}</td>
              <td>
                <span className={`badge ${subject.type.toLowerCase()}`}>
                  {subject.type}
                </span>
              </td>
              <td className="actions">
                <button
                  onClick={() => onEdit(subject)}
                  className="edit-btn"
                >
                  <Pencil className="icon" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(subject._id)}
                  className="delete-btn"
                >
                  <Trash2 className="icon" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}