import React, { useEffect, useState, Fragment } from "react";

const Ripple = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Fragment>
      {isClient && (
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      )}
    </Fragment>
  );
};

export default Ripple;
