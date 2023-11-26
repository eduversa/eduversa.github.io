import { Fragment } from "react";
import { StudentLayout } from "@/layout";
function localStorageClear() {
  localStorage.clear();
}
function index() {
  return (
    <Fragment>
      <StudentLayout>
        <div onClick={localStorageClear}>Logout</div>
      </StudentLayout>
    </Fragment>
  );
}

export default index;
