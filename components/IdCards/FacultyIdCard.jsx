import PropTypes from "prop-types";
import Image from "next/image";
import { useState, useEffect } from "react";

const FacultyImage = ({ image, placeholderImage, altText }) => {
  const [src, setSrc] = useState(image || placeholderImage);

  return (
    <Image
      src={src}
      alt={altText || "Faculty's profile picture"}
      className="faculty-card__image"
      width={100}
      height={100}
      style={{ objectFit: "cover" }}
      onError={() => setSrc(placeholderImage)}
    />
  );
};

const FacultyDetails = ({ icon, value, onClick, tooltipText }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <p
      className="faculty-card__info-item"
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="faculty-card__icon">{icon}</span>
      {value || "N/A"}
      {showTooltip && <span className="tooltip">{tooltipText}</span>}
    </p>
  );
};

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
    if (!faculty?.personal_info?.email) return;
    try {
      const bookmarks =
        JSON.parse(localStorage.getItem("bookmarkedFaculty")) || [];
      setIsBookmarked(bookmarks.includes(faculty.personal_info.email));
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, [faculty?.personal_info?.email]);

  const toggleBookmark = () => {
    try {
      const bookmarks =
        JSON.parse(localStorage.getItem("bookmarkedFaculty")) || [];
      if (isBookmarked) {
        const updatedBookmarks = bookmarks.filter(
          (email) => email !== faculty?.personal_info?.email
        );
        localStorage.setItem("c", JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
      } else {
        bookmarks.push(faculty?.personal_info?.email);
        localStorage.setItem("bookmarkedFaculty", JSON.stringify(bookmarks));
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error interacting with localStorage:", error);
    }
  };

  const handleShare = () => {
    const shareText = `Check out this faculty profile: ${faculty?.personal_info?.first_name} ${faculty?.personal_info?.last_name}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: "Faculty Profile",
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => console.error("Sharing failed:", error));
    } else {
      navigator.clipboard
        .writeText(`${shareText}\n${shareUrl}`)
        .then(() => {
          alert("Profile link copied to clipboard!");
        })
        .catch(() => {
          alert("Unable to copy profile link.");
        });
    }
  };

  const handleViewProfile = () => {
    const profileUrl = `/faculty/${faculty?.personal_info?.email}`;
    window.location.href = profileUrl;
  };

  const { first_name, last_name, email, contact, room, department } =
    faculty?.personal_info || {};

  const handleEmailClick = () => {
    if (
      window.confirm(
        `Are you sure you want to send an email to ${first_name} ${last_name}?`
      )
    ) {
      window.location.href = `mailto:${email}`;
    }
  };

  const handleCallClick = () => {
    if (
      window.confirm(
        `Are you sure you want to call ${first_name} ${last_name}?`
      )
    ) {
      window.location.href = `tel:${contact}`;
    }
  };

  return (
    <div className="faculty-card" role="button">
      <FacultyImage
        image={faculty?.image}
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
            onClick={handleEmailClick}
            tooltipText="Click to send email"
          />
        </div>

        <div className="faculty-card__info-group">
          <FacultyDetails
            icon="📞"
            value={contact}
            onClick={handleCallClick}
            tooltipText="Click to call"
          />
        </div>

        <div className="faculty-card__info-group">
          <FacultyDetails icon="📍" value={room} tooltipText="Room" />
          <FacultyDetails
            icon="🏛️"
            value={department || "Not Assigned"}
            tooltipText="Department"
          />
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
      room: PropTypes.string,
      department: PropTypes.string,
    }).isRequired,
    job_info: PropTypes.shape({
      room: PropTypes.string,
      department: PropTypes.string,
    }),
  }).isRequired,
  placeholderImage: PropTypes.string.isRequired,
};

export default FacultyIdCard;
