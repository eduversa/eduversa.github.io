


import { Fragment } from "react";
import { InfoDescription } from "@/components";
function AboutUs() {
  const aboutData = [
    {
      category : "Problems",
      info : [
        {
          heading : "User Adoption Hindered by Persistent Bugs and Glitches",
          description : "With the current use-case we have found out quite a number of bugs and glitches which hamper the user experience, causing user adoption challenges"
        },
        {
          heading : "Mobile Compatibility Issues",
          description : "Current alternate isnt much friendly and compatible for mobiles and other less sized screens"
        },
        {
          heading : "Schedule management",
          description : "This is something that a teacher might appreciate the most. Imagine you had one single place for your data regarding your college and also all your classes mentioned within the same data-set for ease of access."
        },
        {
          heading : "Communication and updates",
          description : "Currently to link the connection from a teacher to a student, one would have to use a chatting software dedicatedly for the sole purpose of communication. What if there was a feature that would allow us to make announcements that would be declared withing the chosen class."
        },
        {
          heading : "Lack of visual data",
          description : "It is essential to have a feature that can visually represent the data regarding the attendance of the student, the performance of the student and other such things. These sorts of improvements can bring out great changes within the college, students aware of where they stand in the class and their personal performance will help them with growing into becoming someone better."
        },
        {
          heading : "Low rate of interaction",
          description : "As there is not much that us students can do in order to contact a teacher, it would be easier if the students could directly text the teacher from the software itself and the teacher can reply according to their availability. This removes the issue for the teachers to rethink the legitimacy of the student’s identity."
        },
      ]  
    },
    {
      category : "Key Solution and Objective",
      info : [
        {
          heading : "User-Friendly UI and responsiveness",
          description : "Eduversa prioritizes a user-friendly interface, ensuring intuitive functionality and robust management systems to enhance the user experience, also eduversa is a fully responsive design, enabling users to access Eduversa seamlessly across diverse devices, fostering accessibility"
        },
        {
          heading : "Centralized Information",
          description : "The system seeks to centralize all college-related information under a unified framework, promoting transparency and efficiency in academic processes"
        },
        {
          heading : "Digital Administration and Teacher Authority",
          description : "Eduversa empowers administrators and teachers with digital tools, granting them authority over various functions, including routine management and student administration"
        },
        {
          heading : "Role-Based Access Control",
          description : "Implemented a nuanced access control system, tailoring permissions for administrators, teachers, and students based on their distinct roles and responsibilities."
        },
        {
          heading : "Student Portal",
          description : "Eduversa boasts a dedicated student portal, offering registered students seamless access to all necessary data anytime, anywhere."
        },
        {
          heading : "Admin Portal",
          description : "The administrative portal provides comprehensive control, allowing administrators to enroll new applicants and manage essential requirements with utmost authority."
        },
      ]  
    },
    {
      category : "Future Plans",
      info : [
          {
            heading : "Digital Attendance and Class Routine",
            description : "Implement a system for teachers to take digital attendance and manage class routines."
          },
          {
            heading : "Google Classroom-Like Feature",
            description : "Create a platform where teachers can post notes, subject-related information, and students can access it directly."
          },
          {
            heading : "Notification System",
            description : "Integrate a robust notification system to keep both teachers and students informed about important updates and events."
          },
          {
            heading : "Integration with Telegram",
            description : "Connect your website with Telegram for a centralized mode of contact, allowing both teachers and students to access and communicate within the platform."
          },
          {
            heading : "Chatrooms",
            description : "Implement chatrooms where teachers/admins can create specific groups for students to discuss events, projects, or any other relevant topics."
          },
          {
            heading : "Special Access for Admins",
            description : "Develop a feature that allows administrators to grant special access to specific functionalities for a limited time."
          },
          {
            heading : "Active Chatbot",
            description : "Integrate an active chatbot to enhance user experience, providing assistance and information as needed."
          },
          {
            heading : "Continuous Improvement",
            description : "Regularly update and improve existing features to ensure the portal is seamless, bug-free, and responsive."
          },
          {
            heading : "Accessibility Features ",
            description : "Ensuring that the platform is more accessible by incorporating features like screen reader compatibility and keyboard navigation."
          },
          
      ]
    }
  ]

return (
  <Fragment>
    <section className="aboutSection">
      <h3>About Us</h3>
    <div className="aboutInfo">
        <p className="eduIntro">Eduversa represents an advanced college ERP system meticulously crafted to address the intricate data management needs of educational institutions. Functioning as an Enterprise Resource Planning (ERP) software, Eduversa is tailored to streamline processes related to staff, students, and other stakeholders within a college ecosystem.</p>
        <p className="eduTech">Built on cutting-edge technologies, including ReactJs and MongoDB, and enhanced by the use of a pre-processor such as SCSS, Eduversa stands as a testament to modern, efficient, and user-centric design principles.</p>
    </div>

    {
      aboutData.map((item,i) => {
      return <InfoDescription key={i} 
      data = {item}/>
      })
    }
 </section>
  </Fragment>
);
        }

export default AboutUs;