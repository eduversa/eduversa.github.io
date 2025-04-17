import RoomForm from "@/components/AdminForms/Room/RoomForm";
import RoomList from "@/components/AdminForms/Room/RoomList";
import { Navbar } from "@/containers";
import { useAlert } from "@/contexts/AlertContext";
import { devLog } from "@/utils/apiUtils";
import { PlusCircle } from "lucide-react";
import { Fragment, useState } from "react";

function CreateRoom() {
  const { showAlert } = useAlert();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [id, setId] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const handleSubmit = (data) => {
    if (isEditing) {
      setRooms(
        rooms.map((room) => (room._id === data._id ? { ...data } : room))
      );
    } else {
      setRooms([...rooms, { ...data, _id: id }]);
      setId((i) => i + 1);
    }
    showAlert("Task completed");
    setIsFormVisible(false);
    setIsEditing(false);
    setCurrentData(null);
  };

  const onCancel = () => {
    setIsFormVisible(false);
    setIsEditing(false);
    setCurrentData(null);
  };

  const onDelete = (id) => {
    setRooms(rooms.filter((item) => item._id !== id));
    showAlert("Task completed");
  };

  const onEdit = (roomData) => {
    setIsEditing(true);
    setIsFormVisible(true);
    setCurrentData(roomData);
    devLog("room data is", roomData);
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
                  <h1 className="header__title">Room Management</h1>
                  <p className="header__subtitle">Manage all the rooms</p>
                </div>
                <button
                  onClick={() => {
                    setIsFormVisible(true);
                    setIsEditing(false);
                    setCurrentData(null); // Clear form data for new entry
                  }}
                  className="button button--primary button--icon"
                >
                  <PlusCircle size={16} />
                  Add new room
                </button>
              </header>
              {isFormVisible ? (
                <RoomForm
                  onSubmit={handleSubmit}
                  onCancel={onCancel}
                  currentData={currentData}
                />
              ) : (
                <RoomList rooms={rooms} onDelete={onDelete} onEdit={onEdit} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default CreateRoom;
