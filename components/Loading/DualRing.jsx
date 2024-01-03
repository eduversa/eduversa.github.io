import React, { useEffect, useState, Fragment } from "react";

const DualRing = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Fragment>{isClient && <div className="lds-dual-ring"></div>}</Fragment>
  );
};

export default DualRing;
