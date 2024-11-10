import { devLog } from "@/utils/apiUtils";
import { Pencil, Trash2 } from "lucide-react";

export default function StreamList({streams,onDelete,onEdit}) {
    devLog("streams found",streams);

    if(streams.length === 0) {
        return(
            <>
                <div className="empty-state">
                    <p>No streams found</p>
                </div>
            </>
        )
    }
    return (
        <div className="subject-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Stream Name</th>
              <th>Number of Seats</th>
              
            </tr>
          </thead>
          <tbody>
            {streams.map((r, i) => (
              <tr key={i}>
                <td>{r._id}</td>
                <td>{r.name}</td>
                <td>{r.number_seats}</td>
                
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
    )
}