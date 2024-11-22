import PropTypes from "prop-types";
import Image from "next/image";
import { useState, useEffect } from "react";

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

const FacultyDetails = ({ icon, value, onClick }) => (
  <p className="faculty-card__info-item">
    <span className="faculty-card__icon" onClick={onClick}>
      {icon}
    </span>
    {value || "N/A"}
  </p>
);

const BookmarkButton = ({ isBookmarked, toggleBookmark }) => (
  <button
    onClick={toggleBookmark}
    className={`faculty-card__bookmark-button ${
      isBookmarked ? "bookmarked" : ""
    }`}
    aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark"}
  >
    <span className={`bookmark-icon ${isBookmarked ? "filled" : "hollow"}`}>
      &#9733;
    </span>
    {isBookmarked ? "Unbookmark" : "Bookmark"}
  </button>
);

const FacultyIdCard = ({ faculty, placeholderImage }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks =
      JSON.parse(localStorage.getItem("bookmarkedFaculty")) || [];
    setIsBookmarked(bookmarks.includes(faculty.personal_info?.email));
  }, [faculty.personal_info?.email]);

  const toggleBookmark = () => {
    const bookmarks =
      JSON.parse(localStorage.getItem("bookmarkedFaculty")) || [];
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(
        (email) => email !== faculty.personal_info?.email
      );
      localStorage.setItem(
        "bookmarkedFaculty",
        JSON.stringify(updatedBookmarks)
      );
      setIsBookmarked(false);
    } else {
      bookmarks.push(faculty.personal_info?.email);
      localStorage.setItem("bookmarkedFaculty", JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  const handleShare = () => {
    const shareText = `Check out this faculty profile: ${faculty.personal_info?.first_name} ${faculty.personal_info?.last_name}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: "Faculty Profile",
        text: shareText,
        url: shareUrl,
      });
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  const handleViewProfile = () => {
    console.log("Viewing profile of:", faculty.personal_info?.first_name);
  };

  const { first_name, last_name, email, contact } = faculty.personal_info || {};
  const { room, department } = faculty.job_info || {};

  return (
    <div
      className={`faculty-card faculty-card--${department?.toLowerCase()}`}
      role="button"
    >
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
          <FacultyDetails
            icon="📧"
            value={email}
            onClick={() => (window.location.href = `mailto:${email}`)}
          />
        </div>

        <div className="faculty-card__info-group">
          <FacultyDetails
            icon="📞"
            value={contact}
            onClick={() => (window.location.href = `tel:${contact}`)}
          />
        </div>

        <div className="faculty-card__info-group">
          <FacultyDetails icon="📍" value={room} />
          <FacultyDetails icon="🏛️" value={department || "Not Assigned"} />
        </div>
      </div>

      <div className="faculty-card__actions">
        <BookmarkButton
          isBookmarked={isBookmarked}
          toggleBookmark={toggleBookmark}
        />
        <button
          onClick={handleShare}
          className="faculty-card__share-button"
          aria-label="Share Profile"
        >
          Share Profile
        </button>
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
};

export default FacultyIdCard;
