import React, { useEffect, useState, Fragment } from "react";

const Hourglass = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Fragment>{isClient && <div className="lds-hourglass"></div>}</Fragment>
  );
};

export default Hourglass;
