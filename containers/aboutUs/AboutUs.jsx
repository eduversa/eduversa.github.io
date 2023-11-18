import React from "react";

const aboutUs = require("../../data/aboutUs");

function AboutUs() {
  return (
    <div className="about-us-container">
      <div className="description">{aboutUs.description}</div>

      <div className="technologies">{aboutUs.technologies}</div>

      <div className="problems">
        <h2>Problems</h2>
        <ul>
          {Object.values(aboutUs.problems).map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </div>

      <div className="key-solution-and-objective">
        <h2>Key Solution and Objective</h2>
        <div className="user-friendly-ui">
          {aboutUs.keySolutionAndObjective.userFriendlyUI}
        </div>
        <div className="centralized-information">
          {aboutUs.keySolutionAndObjective.centralizedInformation}
        </div>
        <div className="digital-administration-and-teacher-authority">
          {
            aboutUs.keySolutionAndObjective
              .digitalAdministrationAndTeacherAuthority
          }
        </div>
        <div className="mobile-responsiveness">
          {aboutUs.keySolutionAndObjective.mobileResponsiveness}
        </div>
        <div className="role-based-access-control">
          {aboutUs.keySolutionAndObjective.roleBasedAccessControl}
        </div>
        <div className="student-portal">
          {aboutUs.keySolutionAndObjective.studentPortal}
        </div>
        <div className="comprehensive-control">
          {aboutUs.keySolutionAndObjective.comprehensiveControl}
        </div>
      </div>

      <div className="future-plans">
        <h2>Future Plans</h2>
        <div className="description">{aboutUs.futurePlans.description}</div>
        <div className="digital-attendance-and-class-routine">
          {aboutUs.futurePlans.digitalAttendanceAndClassRoutine}
        </div>
        <div className="google-classroom-like-feature">
          {aboutUs.futurePlans.googleClassroomLikeFeature}
        </div>
        <div className="notification-system">
          {aboutUs.futurePlans.notificationSystem}
        </div>
        <div className="integration-with-telegram">
          {aboutUs.futurePlans.integrationWithTelegram}
        </div>
        <div className="chatrooms">{aboutUs.futurePlans.chatrooms}</div>
        <div className="special-access-for-admins">
          {aboutUs.futurePlans.specialAccessForAdmins}
        </div>
        <div className="active-chatbot">
          {aboutUs.futurePlans.activeChatbot}
        </div>
        <div className="continuous-improvement">
          {aboutUs.futurePlans.continuousImprovement}
        </div>
        <div className="accessibility-features">
          {aboutUs.futurePlans.accessibilityFeatures}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
