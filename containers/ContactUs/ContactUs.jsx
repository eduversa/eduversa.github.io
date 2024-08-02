import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
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
          />
          <span className="member__email__link">{member.email}</span>
        </div>
        <p className="member__expertise">Expertise: {member.expertise}</p>
        <p className="member__description">{member.description}</p>
        {member.name === "Ankur Halder (Leader)" && (
          <div className="member__backlink">
            <a
              href="https://www.ankurhalder.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                color: "#0070f3",
                fontWeight: "bold",
                textDecoration: "underline",
                fontSize: "16px",
                transition: "color 0.3s",
                marginTop: "10px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0050c0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#0070f3")}
            >
              Visit Ankur Halder's Website: ankurhalder.in
            </a>
          </div>
        )}
      </div>
    ));
  };

  const handleSocialLoginClick = (provider) => {
    alert(`We are coming on ${provider} soon!`);
  };

  return (
    <Fragment>
      <Head>
        <title>Contact Us - Eduversa Team</title>

        <meta name="description" content={contactUs.teamObjective} />

        <meta
          name="keywords"
          content="contact us, Eduversa team, team members, contact email, team objective, social media"
        />
      </Head>
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
            />
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
              />
            </li>
            <li onClick={() => handleSocialLoginClick("Twitter")}>
              Twitter:
              <Image
                src="/login/twitter.png"
                alt="twitter"
                height={25}
                width={25}
                className="twitter-icon"
              />
            </li>
            <li onClick={() => handleSocialLoginClick("LinkedIn")}>
              LinkedIn:
              <Image
                src="/login/linkedin.png"
                alt="linkedin"
                height={25}
                width={25}
                className="linkedin-icon"
              />
            </li>
            <li onClick={() => handleSocialLoginClick("Facebook")}>
              Facebook:
              <Image
                src="/login/facebook.png"
                alt="facebook"
                height={25}
                width={25}
                className="facebook-icon"
              />
            </li>
            <li onClick={() => handleSocialLoginClick("Instagram")}>
              Instagram:
              <Image
                src="/contactus/instagram.png"
                alt="instagram"
                height={25}
                width={25}
                className="instagram-icon"
              />
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default ContactUs;
