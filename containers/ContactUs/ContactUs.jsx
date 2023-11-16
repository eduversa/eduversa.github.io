import { Fragment } from "react";
function ContactUs() {

  const teamMembers = [
  'Ankur Halder(Leader)',
  'Vidit Modi',
  'Debargha Mondal',
  'Tanay Ghoriwala',
  'Ankan Basak',
  'Shreyasi Roy']


  return (
    <Fragment>
      <div className="ContactUs">
      <p>We are a team of 6 members, with each having expertise in different departments. We are a team which loves and adores making new stuff with an extra advantages of solving problems.</p>
      <ul>
        {teamMembers.map((item,i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>We can be contacted using our email id : - eduversa.developer@gmail.com</p>
      </div>
    </Fragment>
  );
}

export default ContactUs;
