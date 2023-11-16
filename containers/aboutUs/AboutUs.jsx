import { Fragment } from "react";
function AboutUs() {
  const problems = ['The need for a user-friendly UI system',
  'The need to centralize all college-related information under one framework.',
  'Digital administration and teacher authority over various functions, including routine management and student management.']

  const solution = ['User-friendly, with proper functionality and a robust management system',
  'Equipped with a student portal where registered students can access all required data anytime, anywhere','Equipped with an admin portal where the administration has utmost authority, enabling them to enroll new applicants and control necessary requirements']
  return (
    <Fragment>
      <div className="AboutUs">
      <h1>Eduversa - A college erp system</h1>
      <p>Eduversa is a college ERP system designed to handle all the functionalities and data-keeping necessities that a college and its members might require. An ERP system, or Enterprise Resource Planning, is a type of software primarily used by organizations to manage data related to employees, staff, company partners, etc.</p>
      <p>Eduversa aims to enhance transparency and efficiency in academic processes, offering a user-centric approach. The system is built using state-of-the-art technologies, namely ReactJs and MongoDB, along with a pre-processor such as SCSS.</p>
      <p>Eduversa addresses problems such as:</p>
      <ul>
        {problems.map((item,i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>To achieve this goals, Eduversa has been developed to be:</p>
      <ul>
        {solution.map((item,i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      </div>
    </Fragment>

  );
}

export default AboutUs;
