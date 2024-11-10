import StreamForm from "@/components/AdminForms/Stream/StreamForm";
import StreamList from "@/components/AdminForms/Stream/StreamList";
import { useAlert } from "@/contexts/AlertContext";
import { devLog } from "@/utils/apiUtils";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function CreateStream() {
  const { showAlert } = useAlert();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [streams, setStreams] = useState([]);
  const [id, setId] = useState(1);
  const [currentData, setCurrentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (data) => {
    if (isEditing) {
      // Update existing stream data
      setStreams(
        streams.map((stream) => 
          stream._id === data._id ? { ...data } : stream
        )
      );
    } else {
      // Create new stream entry
      setStreams([...streams, { ...data, _id: id }]);
      setId((i) => i + 1);
    }
    
    // Reset form states after submission
    showAlert("Task completed");
    setIsFormVisible(false);
    setIsEditing(false);
    setCurrentData(null); // Clear form data
  };

  const onCancel = () => {
    // Hide form and reset editing state
    setIsFormVisible(false);
    setIsEditing(false);
    setCurrentData(null);
  };

  const onDelete = (id) => {
    // Delete the selected stream
    setStreams(streams.filter((item) => item._id !== id));
    showAlert("Task completed");
  };

  const onEdit = (streamData) => {
    // Prepare form for editing with selected data
    setIsEditing(true);
    setIsFormVisible(true);
    setCurrentData(streamData);
    devLog("Editing stream data:", streamData);
  };

  return (
    <div className="container">
      <div className="content">
        <div className="card">
          <div className="card__body">
            <header className="header">
              <div>
                <h1 className="header__title">Stream Management</h1>
                <p className="header__subtitle">Manage all the streams</p>
              </div>
              <button
                onClick={() => {
                  setIsFormVisible(true);
                  setIsEditing(false);
                  setCurrentData(null);
                }}
                className="button button--primary button--icon"
              >
                <PlusCircle size={16} />
                Add new stream
              </button>
            </header>

            {isFormVisible ? (
              <StreamForm
                onSubmit={handleSubmit}
                onCancel={onCancel}
                currentData={currentData} 
              />
            ) : (
              <StreamList
                streams={streams}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
