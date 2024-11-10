import { devLog } from "@/utils/apiUtils";
import { Pencil, Trash2 } from "lucide-react";

export default function RoomList({ rooms,onDelete,onEdit }) {
  devLog("rooms found", rooms);
  if (rooms.length === 0) {
    return (
      <>
        <div className="empty-state">
          <p>No rooms found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="subject-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Room Name</th>
              <th>Building</th>
              <th>Room Type</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r, i) => (
              <tr key={i}>
                <td>{r._id}</td>
                <td>{r.name}</td>
                <td>{r.building}</td>
                <td> 
                  <span className={`badge ${r.type.toLowerCase()}`}>
                  {r.type}
                  </span>
                   </td>
                <td>
                  {r.capacity}
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
