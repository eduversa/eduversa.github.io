import PropTypes from "prop-types";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";

const FacultyImage = ({ image, placeholderImage, altText }) => {
  const [src, setSrc] = useState(placeholderImage);

  useEffect(() => {
    setSrc(image || placeholderImage);
  }, [image, placeholderImage]);

  const handleError = useCallback(() => {
    if (src !== placeholderImage) {
      setSrc(placeholderImage);
    }
  }, [src, placeholderImage]);

  return (
    <Image
      src={src}
      alt={altText || "Faculty profile picture"}
      className="faculty-card__image"
      width={100}
      height={100}
      style={{ objectFit: "cover", borderRadius: "50%" }}
      onError={handleError}
      priority={false}
    />
  );
};

FacultyImage.propTypes = {
  image: PropTypes.string,
  placeholderImage: PropTypes.string.isRequired,
  altText: PropTypes.string,
};

const FacultyDetails = ({ icon, value, onClick, tooltipText, ariaLabel }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const Tag = onClick ? "button" : "p";

  const handleMouseEnter = useCallback(() => setShowTooltip(true), []);
  const handleMouseLeave = useCallback(() => setShowTooltip(false), []);
  const handleFocus = useCallback(() => setShowTooltip(true), []);
  const handleBlur = useCallback(() => setShowTooltip(false), []);

  return (
    <Tag
      className={`faculty-card__info-item ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={ariaLabel || tooltipText}
      title={tooltipText}
      type={Tag === "button" ? "button" : undefined}
    >
      <span className="faculty-card__icon" aria-hidden="true">
        {icon}
      </span>
      {value || "N/A"}
      {showTooltip && tooltipText && (
        <span className="tooltip" role="tooltip">
          {tooltipText}
        </span>
      )}
    </Tag>
  );
};

FacultyDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.string,
  onClick: PropTypes.func,
  tooltipText: PropTypes.string,
  ariaLabel: PropTypes.string,
};

const BookmarkButton = ({ isBookmarked, toggleBookmark }) => (
  <button
    onClick={toggleBookmark}
    className={`faculty-card__bookmark-button ${
      isBookmarked ? "bookmarked" : ""
    }`}
    aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    aria-pressed={isBookmarked}
    type="button"
  >
    <span
      className={`bookmark-icon ${isBookmarked ? "filled" : "hollow"}`}
      aria-hidden="true"
    >
      &#9733;
    </span>
    {isBookmarked ? "Bookmarked" : "Bookmark"}
  </button>
);

BookmarkButton.propTypes = {
  isBookmarked: PropTypes.bool.isRequired,
  toggleBookmark: PropTypes.func.isRequired,
};

const FacultyIdCard = ({
  faculty,
  placeholderImage,
  bookmarkedEmails,
  onToggleBookmark,
}) => {
  const router = useRouter();
  const facultyEmail = faculty?.personal_info?.email;

  const isCurrentlyBookmarked = useMemo(() => {
    return facultyEmail ? bookmarkedEmails.includes(facultyEmail) : false;
  }, [bookmarkedEmails, facultyEmail]);

  const handleBookmarkClick = useCallback(() => {
    if (facultyEmail) {
      onToggleBookmark(facultyEmail);
    }
  }, [facultyEmail, onToggleBookmark]);

  const handleShare = useCallback(async () => {
    if (!faculty?.personal_info) return;
    const { first_name = "", last_name = "" } = faculty.personal_info;
    const name = `${first_name} ${last_name}`.trim() || "Faculty";
    const shareText = `Check out ${name}'s profile.`;

    const profilePath = facultyEmail
      ? `/faculty/${encodeURIComponent(facultyEmail)}`
      : window.location.pathname;
    const shareUrl = `${window.location.origin}${profilePath}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} - Faculty Profile`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Sharing failed:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("Profile link copied to clipboard!");
      } catch (error) {
        console.error("Clipboard write failed:", error);
        alert("Unable to copy profile link.");
      }
    }
  }, [faculty, facultyEmail]);

  const handleViewProfile = useCallback(() => {
    if (facultyEmail) {
      router.push(`/faculty/${encodeURIComponent(facultyEmail)}`);
    } else {
      console.warn("Cannot view profile, faculty email is missing.");
    }
  }, [facultyEmail, router]);

  const { first_name, last_name, email, contact } =
    faculty?.personal_info || {};
  const { room, department } = faculty?.job_info || {};

  const handleEmailClick = useCallback(() => {
    if (!email) return;
    const name = `${first_name || ""} ${last_name || ""}`.trim();
    if (
      window.confirm(
        `Are you sure you want to send an email to ${name || "this faculty"}?`
      )
    ) {
      window.location.href = `mailto:${email}`;
    }
  }, [email, first_name, last_name]);

  const handleCallClick = useCallback(() => {
    if (!contact) return;
    const name = `${first_name || ""} ${last_name || ""}`.trim();
    if (
      window.confirm(`Are you sure you want to call ${name || "this faculty"}?`)
    ) {
      window.location.href = `tel:${contact}`;
    }
  }, [contact, first_name, last_name]);

  const fullName = useMemo(
    () => `${first_name || ""} ${last_name || ""}`.trim() || "Faculty Member",
    [first_name, last_name]
  );

  return (
    <div className="faculty-card">
      <FacultyImage
        image={faculty?.image}
        placeholderImage={placeholderImage}
        altText={`${fullName}'s profile picture`}
      />
      <h2 className="faculty-card__name">{fullName}</h2>

      <div className="faculty-card__info">
        {email && (
          <FacultyDetails
            icon="📧"
            value={email}
            onClick={handleEmailClick}
            tooltipText={`Send email to ${fullName}`}
            ariaLabel={`Send email to ${fullName} (${email})`}
          />
        )}
        {contact && (
          <FacultyDetails
            icon="📞"
            value={contact}
            onClick={handleCallClick}
            tooltipText={`Call ${fullName}`}
            ariaLabel={`Call ${fullName} (${contact})`}
          />
        )}
        {room && (
          <FacultyDetails
            icon="📍"
            value={room}
            tooltipText="Room Number"
            ariaLabel={`Room number ${room}`}
          />
        )}
        {department && (
          <FacultyDetails
            icon="🏛️"
            value={department}
            tooltipText="Department"
            ariaLabel={`Department ${department}`}
          />
        )}
      </div>

      <div className="faculty-card__actions">
        {facultyEmail && (
          <BookmarkButton
            isBookmarked={isCurrentlyBookmarked}
            toggleBookmark={handleBookmarkClick}
          />
        )}
        <button
          onClick={handleShare}
          className="faculty-card__share-button"
          aria-label={`Share ${fullName}'s Profile`}
          type="button"
        >
          Share
        </button>
        {facultyEmail && (
          <button
            onClick={handleViewProfile}
            className="faculty-card__view-profile-button"
            aria-label={`View ${fullName}'s Profile`}
            type="button"
          >
            View Profile
          </button>
        )}
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
    }).isRequired,
    job_info: PropTypes.shape({
      room: PropTypes.string,
      department: PropTypes.string,
    }),
  }).isRequired,
  placeholderImage: PropTypes.string.isRequired,
  bookmarkedEmails: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleBookmark: PropTypes.func.isRequired,
};

FacultyIdCard.defaultProps = {
  faculty: {
    personal_info: {},
    job_info: {},
  },
  bookmarkedEmails: [],
};

export default FacultyIdCard;
