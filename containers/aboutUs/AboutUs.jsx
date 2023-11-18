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
        <h3>About Eduversa</h3>
        <div className="description">{aboutUs.description}</div>

        <div className="technologies">{aboutUs.technologies}</div>

        <div className="problems">
          <h2 onClick={() => toggleSection("problems")}>Problems</h2>
          {generateProblemsContent()}
        </div>

        <div className="key-solution-and-objective">
          <h2 onClick={() => toggleSection("keySolution")}>
            Key Solution and Objective
          </h2>
          {generateKeySolutionAndObjectiveContent()}
        </div>

        <div className="future-plans">
          <h2 onClick={() => toggleSection("futurePlans")}>Future Plans</h2>
          {generateFuturePlansContent()}
        </div>
      </div>
    </Fragment>
  );
}

export default AboutUs;
