import React, { Fragment } from "react";
import Image from "next/image";

import contactUs from "../../data/ContactUs";

const ContactUs = () => {
  const { teamMembers, contactEmail, teamObjective, additionalInformation } =
    contactUs;

  const renderTeamMembers = () => {
    return teamMembers.map((member, index) => (
      <div key={index} className="member">
        <h3 className="member__heading">{member.name}</h3>
        <p className="member__email">Email: {member.email}</p>
        <p className="member__expertise">Expertise: {member.expertise}</p>
        <p className="member__description">{member.description}</p>
      </div>
    ));
  };
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const containerClass = authToken
    ? "contact-us-container"
    : "contact-us-landing-container";
  const handleSocialLoginClick = (provider) => {
    alert(`We are coming on ${provider} soon!`);
  };
  return (
    <Fragment>
      <div className={containerClass}>
        <h2 className="contact-us-heading">Contact Us</h2>

        <div className="team-members">
          <h3 className="team-members-heading">Our Team</h3>
          {renderTeamMembers()}
        </div>

        <div className="contact-email">
          <h3 className="contact-email-heading">Contact Email</h3>
          <p className="contact-email-content">{contactEmail}</p>
        </div>

        <div className="team-objective">
          <h3 className="team-objective-heading">Team Objective</h3>
          <p className="team-objective-content">{teamObjective}</p>
        </div>

        <div className="additional-information">
          <h3 className="additional-information-heading">
            Additional Information
          </h3>
          <div className="social-media">
            <h4 className="social-media-heading">Social Media</h4>
            <ul>
              <li
                onClick={() => {
                  const github = document.createElement("a");
                  github.href = additionalInformation.socialMedia.github;
                  github.target = "_blank";
                  github.click();
                }}
              >
                GitHub:
                <Image
                  src="/login/github.png"
                  alt="github"
                  height={25}
                  width={25}
                  className="github-icon"
                ></Image>
              </li>
              <li onClick={() => handleSocialLoginClick("Twitter")}>
                Twitter:
                <Image
                  src="/login/twitter.png"
                  alt="twitter"
                  height={25}
                  width={25}
                  className="twitter-icon"
                ></Image>
              </li>
              <li onClick={() => handleSocialLoginClick("LinkedIn")}>
                LinkedIn:
                <Image
                  src="/login/linkedin.png"
                  alt="linkedin"
                  height={25}
                  width={25}
                  className="linkedin-icon"
                ></Image>
              </li>
              <li onClick={() => handleSocialLoginClick("Facebook")}>
                Facebook:
                <Image
                  src="/login/facebook.png"
                  alt="facebook"
                  height={25}
                  width={25}
                  className="facebook-icon"
                ></Image>
              </li>
              <li>
                Instagram:
                <Image
                  src="/contactus/instagram.png"
                  alt="instagram"
                  height={25}
                  width={25}
                  className="instagram-icon"
                ></Image>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ContactUs;
