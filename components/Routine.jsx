import React from "react";


const routineData = [
  {
    period: 1,
    subjects: ["Mathematics", "English", "History", "Science", "Art"],
    teachers: [
      "Mrs. Jane Doe",
      "Mr. John Smith",
      "Ms. Sarah Lee",
      "Dr. Michael Johnson",
      "Ms. Emily Davis",
    ],
  },
  {
    period: 2,
    subjects: ["English", "Mathematics", "Art", "History", "Science"],
    teachers: [
      "Mr. John Smith",
      "Mrs. Jane Doe",
      "Ms. Emily Davis",
      "Ms. Sarah Lee",
      "Dr. Michael Johnson",
    ],
  },
  {
    period: 3,
    subjects: ["History", "Science", "Mathematics", "Art", "English"],
    teachers: [
      "Ms. Sarah Lee",
      "Dr. Michael Johnson",
      "Mrs. Jane Doe",
      "Ms. Emily Davis",
      "Mr. John Smith",
    ],
  },
  {
    period: 4,
    subjects: ["Science", "Art", "English", "Mathematics", "History"],
    teachers: [
      "Dr. Michael Johnson",
      "Ms. Emily Davis",
      "Mr. John Smith",
      "Mrs. Jane Doe",
      "Ms. Sarah Lee",
    ],
  },
  {
    period: 5,
    subjects: ["Art", "History", "Science", "English", "Mathematics"],
    teachers: [
      "Ms. Emily Davis",
      "Ms. Sarah Lee",
      "Dr. Michael Johnson",
      "Mr. John Smith",
      "Mrs. Jane Doe",
    ],
  },
  {
    period: 6,
    subjects: ["Mathematics", "Science", "English", "Art", "History"],
    teachers: [
      "Mrs. Jane Doe",
      "Dr. Michael Johnson",
      "Mr. John Smith",
      "Ms. Emily Davis",
      "Ms. Sarah Lee",
    ],
  },
  {
    period: 7,
    subjects: ["English", "Art", "History", "Science", "Mathematics"],
    teachers: [
      "Mr. John Smith",
      "Ms. Emily Davis",
      "Ms. Sarah Lee",
      "Dr. Michael Johnson",
      "Mrs. Jane Doe",
    ],
  },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const colors = ["blue", "green", "yellow", "red", "purple"];

export default function Routine() {
  return (
    <div className="routine-container">
      <div className="routine-card">
        <div className="routine-header">
          <h2>Class Routine Schedule</h2>
          <div className="date-range">Monday - Friday</div>
        </div>

        <div className="routine-grid-wrapper">
          <div className="routine-grid">
            <div className="grid-header">Period</div>
            {days.map((day, index) => (
              <div
                key={day}
                className={`grid-header day ${colors[index % colors.length]}`}
              >
                {day}
              </div>
            ))}

            {routineData.map(({ period, subjects, teachers }) => (
              <React.Fragment key={period}>
                <div className="period-number">{period}</div>
                {subjects.map((subject, index) => (
                  <div
                    key={`${period}-${days[index]}`}
                    className={`subject-cell ${colors[index % colors.length]}`}
                  >
                    <h3>{subject}</h3>
                    <p>{teachers[index]}</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
