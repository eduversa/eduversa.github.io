import { Fragment } from "react";

const ManageApp = ({ data }) => {
  if (data?.length === 0) return <p>No data found..</p>;
  return (
    <Fragment>
      <div className="main-applicant-container">
        <div className="applicant-container-box">
          {data?.map((item) => (
            <div key={item._id} className="applicant-item">
              <div className="applicant-item--inner">
                <div className="applicant-item-bg"> </div>
                <div className="applicant-item--name">
                  <p>
                    <span>Name: {item.personal_info.first_name}</span>{" "}
                    <span>{item.personal_info.last_name}</span>
                  </p>
                </div>
                <div className="applicant-item--course">
                  <p>Course: {item.course_info.course_name}</p>
                </div>
                <div className="applicant-item-item_stream">
                  {item.course_info.stream !== "NA" ? (
                    <p>Stream: {item.course_info.stream}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default ManageApp;
