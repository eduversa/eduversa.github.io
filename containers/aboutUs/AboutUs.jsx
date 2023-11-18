import React, { useState, Fragment } from "react";

const aboutUs = require("../../data/aboutUs");

function AboutUs() {
  const [showProblems, setShowProblems] = useState(false);
  const [showKeySolution, setShowKeySolution] = useState(false);
  const [showFuturePlans, setShowFuturePlans] = useState(false);
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const containerClass = authToken
    ? "about-us-container"
    : "about-us-landing-container";

  const toggleSection = (section) => {
    switch (section) {
      case "problems":
        setShowProblems(!showProblems);
        break;
      case "keySolution":
        setShowKeySolution(!showKeySolution);
        break;
      case "futurePlans":
        setShowFuturePlans(!showFuturePlans);
        break;
      default:
        break;
    }
  };

  const generateProblemsContent = () => {
    if (showProblems) {
      return Object.entries(aboutUs.problems).map(([key, value], index) => (
        <div
          key={index}
          className={`problem-${key.toLowerCase().replace(/ /g, "-")}`}
        >
          <p className={`${key.toLowerCase().replace(/ /g, "-")}-heading`}>
            {key}
          </p>
          {value}
        </div>
      ));
    }
    return null;
  };

  const generateKeySolutionAndObjectiveContent = () => {
    if (showKeySolution) {
      return Object.entries(aboutUs.keySolutionAndObjective).map(
        ([key, value], index) => (
          <div
            key={index}
            className={`key-solution-and-objective-${key
              .toLowerCase()
              .replace(/ /g, "-")}`}
          >
            <p className={`${key.toLowerCase().replace(/ /g, "-")}-heading`}>
              {key}
            </p>
            {value}
          </div>
        )
      );
    }
    return null;
  };

  const generateFuturePlansContent = () => {
    if (showFuturePlans) {
      return Object.entries(aboutUs.futurePlans).map(([key, value], index) => (
        <div
          key={index}
          className={`future-plans-${key.toLowerCase().replace(/ /g, "-")}`}
        >
          <p className={`${key.toLowerCase().replace(/ /g, "-")}-heading`}>
            {key}
          </p>
          {value}
        </div>
      ));
    }
    return null;
  };

  return (
    <Fragment>
      <div className={containerClass}>
        <h3 className="aboutus-heading">About Eduversa</h3>
        <div className="description">
          <h4 className="description-heading">description</h4>
          <p>{aboutUs.description}</p>
        </div>
        <div className="technologies">
          <h4 className="technologies-heading">Technologies</h4>
          <p>{aboutUs.technologies}</p>
        </div>

        <div className="problems">
          <h2 onClick={() => toggleSection("problems")}>Problems</h2>
          <div className="grid">{generateProblemsContent()}</div>
        </div>

        <div className="key-solution-and-objective">
          <h2 onClick={() => toggleSection("keySolution")}>
            Key Solution and Objective
          </h2>
          <div className="grid">{generateKeySolutionAndObjectiveContent()}</div>
        </div>

        <div className="future-plans">
          <h2 onClick={() => toggleSection("futurePlans")}>Future Plans</h2>
          <div className="grid">{generateFuturePlansContent()}</div>
        </div>
      </div>
    </Fragment>
  );
}

export default AboutUs;
