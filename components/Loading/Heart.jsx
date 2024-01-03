import React, { useEffect, useState, Fragment } from "react";

const Heart = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Fragment>
      {isClient && (
        <div className="lds-heart">
          <div></div>
        </div>
      )}
    </Fragment>
  );
};

export default Heart;
