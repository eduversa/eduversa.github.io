import React, { useEffect, useState, Fragment } from "react";

const Circle = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Fragment>
      {isClient && (
        <div className="lds-circle">
          <div></div>
        </div>
      )}
    </Fragment>
  );
};

export default Circle;
