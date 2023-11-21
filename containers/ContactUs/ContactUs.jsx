import React, { Fragment } from "react";
const contactUs = require("../../data/ContactUs");
const ContactUs = () => {
  const { teamMembers, contactEmail, teamObjective, additionalInformation } =
    contactUs;

  const renderTeamMembers = () => {
    return teamMembers.map((member, index) => (
      <div key={index} className={`team-member-${index + 1}`}>
        <h3 className={`team-member-${index + 1}-heading`}>{member.name}</h3>
        <p>Email: {member.email}</p>
        <p>Expertise: {member.expertise}</p>
        <p>{member.description}</p>
      </div>
    ));
  };

  return (
    <Fragment>
      <div className="contact-us-container">
        <h2 className="contact-us-heading">Contact Us</h2>

        <div className="team-members">
          <h3 className="team-members-heading">Our Team</h3>
          {renderTeamMembers()}
        </div>

        <div className="contact-email">
          <h3 className="contact-email-heading">Contact Email</h3>
          <p>{contactEmail}</p>
        </div>

        <div className="team-objective">
          <h3 className="team-objective-heading">Team Objective</h3>
          <p>{teamObjective}</p>
        </div>

        <div className="additional-information">
          <h3 className="additional-information-heading">
            Additional Information
          </h3>
          <div className="social-media">
            <h4 className="social-media-heading">Social Media</h4>
            <ul>
              <li>
                Twitter:
                <a
                  href={additionalInformation.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {additionalInformation.socialMedia.twitter}
                </a>
              </li>
              <li>
                LinkedIn:
                <a
                  href={additionalInformation.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {additionalInformation.socialMedia.linkedin}
                </a>
              </li>
              <li>
                GitHub:
                <a
                  href={additionalInformation.socialMedia.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {additionalInformation.socialMedia.github}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ContactUs;
