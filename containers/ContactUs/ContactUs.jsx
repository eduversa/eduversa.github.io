import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";

import contactUs from "../../data/ContactUs";

const ContactUs = () => {
  const { teamMembers, contactEmail, teamObjective, additionalInformation } =
    contactUs;
  const [containerClass, setContainerClass] = useState("");
  function emailHandler(contactEmail) {
    window.location.href = `mailto:${contactEmail}`;
  }
  const eduversaEmail = "eduversa.developer@gmail.com";
  function contactEduversa() {
    window.location.href = `mailto:${eduversaEmail}`;
  }

  useEffect(() => {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const newContainerClass = authToken
      ? "contact-us-container"
      : "contact-us-landing-container";
    setContainerClass(newContainerClass);
  }, []);

  const renderTeamMembers = () => {
    return teamMembers.map((member, index) => (
      <div key={index} className="member">
        <h3 className="member__heading">{member.name}</h3>
        <div
          onClick={() => {
            emailHandler(contactEmail);
          }}
          className="member__email"
        >
          <Image
            src="/contactus/mail.png"
            alt="email"
            height={20}
            width={20}
            className="member__email__icon"
          ></Image>
          <span className="member__email__link">{member.email}</span>
        </div>
        <p className="member__expertise">Expertise: {member.expertise}</p>
        <p className="member__description">{member.description}</p>
      </div>
    ));
  };

  const handleSocialLoginClick = (provider) => {
    alert(`We are coming on ${provider} soon!`);
  };
  return (
    <Fragment>
      <div className={containerClass}>
        <h2 className="contact-us-heading">Contact Us</h2>

        <div className="team-members">
          <h3 className="team-members__heading">Our Team</h3>
          {renderTeamMembers()}
        </div>

        <div className="contact-email">
          <h3 className="contact-email__heading">Contact Email</h3>
          <div className="contact-email__container" onClick={contactEduversa}>
            <Image
              src="/contactus/mail.png"
              alt="email"
              height={20}
              width={20}
              className="contact-email__container__icon"
            ></Image>
            <p className="contact-email__container__content">{contactEmail}</p>
          </div>
        </div>

        <div className="team-objective">
          <h3 className="team-objective__heading">Team Objective</h3>
          <p className="team-objective__content">{teamObjective}</p>
        </div>

        <div className="social-media">
          <h4 className="social-media__heading">Connect Us With</h4>
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
            <li onClick={() => handleSocialLoginClick("Instagram")}>
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
    </Fragment>
  );
};

export default ContactUs;
