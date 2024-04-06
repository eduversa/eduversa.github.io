import { AdminLayout } from "@/layout";
import React, { Fragment } from "react";
import { ContactUs } from "@/containers";

const Contact = () => {
  return (
    <Fragment>
      <AdminLayout>
        <ContactUs></ContactUs>
      </AdminLayout>
    </Fragment>
  );
};

export default Contact;
