import React, { useEffect, useState, Fragment } from "react";

const Facebook = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Fragment>
      {isClient && (
        <div className="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </Fragment>
  );
};

export default Facebook;
