import PropTypes from "prop-types";
import Image from "next/image";

const FacultyIdCard = ({
  faculty,
  placeholderImage,
  isFavorite,
  toggleFavorite,
}) => {
  const facultyId = faculty.user_id;

  const handleViewProfile = () => {
    localStorage.setItem("selectedFacultyId", facultyId);
    console.log(localStorage.getItem("selectedFacultyId"));
  };

  return (
    <div className="faculty-card">
      <Image
        src={faculty.image || placeholderImage}
        alt={`${faculty.personal_info.first_name || "No Name"}'s Image`}
        className="faculty-image"
        width={100}
        height={100}
        objectFit="cover"
      />
      <h2>
        {faculty.personal_info.first_name || "No Name"}{" "}
        {faculty.personal_info.last_name || ""}
      </h2>
      <p>Email: {faculty.personal_info?.email || "N/A"}</p>
      <p>User ID: {faculty.user_id}</p>
      <p>
        Address: {faculty.personal_info.present_address?.street || "N/A"},{" "}
        {faculty.personal_info.present_address?.city || "N/A"},{" "}
        {faculty.personal_info.present_address?.district || "N/A"},{" "}
        {faculty.personal_info.present_address?.state || "N/A"}
      </p>
      <p>Gender: {faculty.personal_info.gender || "N/A"}</p>
      <p>
        DOB:{" "}
        {faculty.personal_info.dob
          ? new Date(faculty.personal_info.dob).toLocaleDateString()
          : "N/A"}
      </p>
      <p>Contact: {faculty.personal_info.contact || "N/A"}</p>
      <p>Faculty ID: {faculty.job_info.faculty_id}</p>
      <p>Room: {faculty.job_info.room || "N/A"}</p>
      <p>Department: {faculty.job_info.department || "Not Assigned"}</p>

      <button
        onClick={toggleFavorite}
        className={`favorite-button ${isFavorite ? "favorited" : ""}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "Unfavorite" : "Favorite"}
      </button>

      <button
        onClick={handleViewProfile}
        className="view-profile-button"
        aria-label="View Profile"
      >
        View Profile
      </button>
    </div>
  );
};

FacultyIdCard.propTypes = {
  faculty: PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    image: PropTypes.string,
    personal_info: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
      present_address: PropTypes.shape({
        street: PropTypes.string,
        city: PropTypes.string,
        district: PropTypes.string,
        state: PropTypes.string,
      }),
      gender: PropTypes.string,
      dob: PropTypes.string,
      contact: PropTypes.string,
    }),
    job_info: PropTypes.shape({
      faculty_id: PropTypes.string,
      room: PropTypes.string,
      department: PropTypes.string,
    }),
  }).isRequired,
  placeholderImage: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
};

export default FacultyIdCard;
