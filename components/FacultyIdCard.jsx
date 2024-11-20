import PropTypes from "prop-types";
import Image from "next/image";

const FacultyImage = ({ image, placeholderImage, altText }) => (
  <Image
    src={image || placeholderImage}
    alt={altText || "Faculty's profile picture"}
    className="faculty-card__image"
    width={100}
    height={100}
    style={{ objectFit: "cover" }}
  />
);

const FacultyDetails = ({ label, value }) => (
  <p className="faculty-card__info-item">
    <strong>{label}:</strong> {value || "N/A"}
  </p>
);

const FavoriteButton = ({ isFavorite, toggleFavorite }) => (
  <button
    onClick={toggleFavorite}
    className={`faculty-card__favorite-button ${isFavorite ? "favorited" : ""}`}
    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
  >
    {isFavorite ? "Unfavorite" : "Favorite"}
  </button>
);

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

  const {
    first_name,
    last_name,
    email,
    present_address,
    gender,
    dob,
    contact,
  } = faculty.personal_info || {};
  const { faculty_id, room, department } = faculty.job_info || {};

  return (
    <div className="faculty-card" role="button">
      <FacultyImage
        image={faculty.image}
        placeholderImage={placeholderImage}
        altText={`${first_name || "No Name"}'s profile picture`}
      />
      <h2 className="faculty-card__name">
        {first_name || "No Name"} {last_name || ""}
      </h2>

      <div className="faculty-card__info">
        <div className="faculty-card__info-group">
          <FacultyDetails label="Email" value={email} />
          <FacultyDetails label="User ID" value={faculty.user_id} />
        </div>

        <div className="faculty-card__info-group">
          <FacultyDetails
            label="Address"
            value={`${present_address?.street || "N/A"}, ${
              present_address?.city || "N/A"
            }, ${present_address?.district || "N/A"}, ${
              present_address?.state || "N/A"
            }`}
          />
        </div>

        <div className="faculty-card__info-group">
          <FacultyDetails label="Gender" value={gender} />
          <FacultyDetails
            label="DOB"
            value={dob ? new Date(dob).toLocaleDateString() : "N/A"}
          />
          <FacultyDetails label="Contact" value={contact} />
        </div>

        <div className="faculty-card__info-group">
          <FacultyDetails label="Faculty ID" value={faculty_id} />
          <FacultyDetails label="Room" value={room} />
          <FacultyDetails
            label="Department"
            value={department || "Not Assigned"}
          />
        </div>
      </div>

      <div className="faculty-card__actions">
        <FavoriteButton
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
        <button
          onClick={handleViewProfile}
          className="faculty-card__view-profile-button"
          aria-label="View Profile"
        >
          View Profile
        </button>
      </div>
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
