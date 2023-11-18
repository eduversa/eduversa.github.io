import React from "react";

const aboutUs = require("../../data/aboutUs");

function AboutUs() {
  const generateProblemsContent = () => {
    return Object.entries(aboutUs.problems).map(([key, value], index) => (
      <div
        key={index}
        className={`problem-${key.toLowerCase().replace(/ /g, "-")}`}
      >
        {value}
      </div>
    ));
  };

  const generateKeySolutionAndObjectiveContent = () => {
    return Object.entries(aboutUs.keySolutionAndObjective).map(
      ([key, value], index) => (
        <div
          key={index}
          className={`key-solution-and-objective-${key
            .toLowerCase()
            .replace(/ /g, "-")}`}
        >
          {value}
        </div>
      )
    );
  };

  const generateFuturePlansContent = () => {
    return Object.entries(aboutUs.futurePlans).map(([key, value], index) => (
      <div
        key={index}
        className={`future-plans-${key.toLowerCase().replace(/ /g, "-")}`}
      >
        {value}
      </div>
    ));
  };

  return (
    <div className="about-us-container">
      <div className="description">{aboutUs.description}</div>

      <div className="technologies">{aboutUs.technologies}</div>

      <div className="problems">
        <h2>Problems</h2>
        {generateProblemsContent()}
      </div>

      <div className="key-solution-and-objective">
        <h2>Key Solution and Objective</h2>
        {generateKeySolutionAndObjectiveContent()}
      </div>

      <div className="future-plans">
        <h2>Future Plans</h2>
        {generateFuturePlansContent()}
      </div>
    </div>
  );
}

export default AboutUs;
