import Routine from "@/components/Routine";
import { Fragment } from "react";
import { StudentLayout } from "@/layout";
import React from "react";

const RoutineComponent = () => {
  return (
    <div>
      <Fragment>
        <StudentLayout>
          <Routine />
        </StudentLayout>
      </Fragment>
    </div>
  );
};

export default RoutineComponent;
