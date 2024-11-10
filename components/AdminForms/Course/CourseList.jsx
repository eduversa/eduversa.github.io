import { devLog } from "@/utils/apiUtils";
import {Pencil,Trash2} from "lucide-react";
export default function CourseList({courses,onDelete,onEdit}) {
    devLog("course found",courses);

    if(courses.length === 0) {
    return (
        <>
        <div className="empty-state">
          <p>No courses found.</p>
        </div>
        </>
    )
    }

    return (
        <>
          <div className="subject-list">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Fees</th>
                  <th>Duration</th>
                  <th>Total Seats</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((r, i) => (
                  <tr key={i}>
                    <td>{r._id}</td>
                    <td>{r.name}</td>
                    <td>{r.fees}</td>
                    <td> 
                      <span className={`badge ${r.duration.toLowerCase()}`}>
                      {r.duration}
                      </span>
                       </td>
                    <td>
                      {r.total_seats}
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => onEdit(r)}
                        className="edit-btn"
                      >
                        <Pencil className="icon" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(r._id)}
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
        </>
      );

}
