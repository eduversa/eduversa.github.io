import React, { Fragment } from "react";
import {
  Circle,
  Default,
  DualRing,
  Ellipsis,
  Facebook,
  Grid,
  Heart,
  Hourglass,
  Ring,
  Ripple,
  Roller,
  Spinner,
} from ".";

const loaderComponents = [
  Circle,
  Default,
  DualRing,
  Ellipsis,
  Facebook,
  Grid,
  Heart,
  Hourglass,
  Ring,
  Ripple,
  Roller,
  Spinner,
];

function getRandomLoaderComponent() {
  const randomIndex = Math.floor(Math.random() * loaderComponents.length);
  return loaderComponents[randomIndex];
}

function AllLoader() {
  const RandomLoader = getRandomLoaderComponent();

  return (
    <Fragment>
      <div className="loader-container">
        <RandomLoader />
      </div>
    </Fragment>
  );
}

export default AllLoader;
