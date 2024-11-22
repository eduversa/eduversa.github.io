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
    <span className={`favorite-icon ${isFavorite ? "filled" : "hollow"}`}>
      &#10084;
    </span>
    {isFavorite ? "Unfavorite" : "Favorite"}
  </button>
);

const FacultyIdCard = ({
  faculty,
  placeholderImage,
  isFavorite,
  toggleFavorite,
}) => {
  const handleViewProfile = () => {
    console.log("Viewing profile of:", faculty.personal_info?.first_name);
  };

  const { first_name, last_name, email, contact } = faculty.personal_info || {};
  const { room, department } = faculty.job_info || {};

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
        </div>

        <div className="faculty-card__info-group">
          <FacultyDetails label="Contact" value={contact} />
        </div>

        <div className="faculty-card__info-group">
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
    image: PropTypes.string,
    personal_info: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
      contact: PropTypes.string,
    }),
    job_info: PropTypes.shape({
      room: PropTypes.string,
      department: PropTypes.string,
    }),
  }).isRequired,
  placeholderImage: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
};

export default FacultyIdCard;
