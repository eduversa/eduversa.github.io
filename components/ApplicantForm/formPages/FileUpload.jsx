import React, {useState} from 'react'

const FileUpload = ({ formData, handleChange, handleSave, handleNextClick, handlePreviousClick, handleSubmit }) => {
  const [photo, setPhoto] = useState(null);

  const handlePhotoUpload = (event) => {
    const uploadedPhoto = event.target.files[0];
    setPhoto(uploadedPhoto);
  };

  const handlePhotoSave = () => {
    // Store the photo in formData
    setFormData({
      ...formData,
      photo: photo, // Update the photo field in formData with the uploaded photo
    });
  };
  return (
    <div className="page">
      <h2 className="page--title">File Upload</h2>
      <form className="page--content" onSubmit={handleSubmit}>
        <div>
          {/* File Input for photo upload */}
          <label>Upload photo:</label>
          <input type="file" onChange={handlePhotoUpload} accept="image/*" />

        </div>
        <div className="btns"> {/* buttons */}
          <button
            type="button"
            className="btn"
            onClick={handlePreviousClick}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              handlePhotoSave();
              handleSave();
            }}
          >
            Save
          </button>
          <button
            type="submit"
            className="btn"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default FileUpload