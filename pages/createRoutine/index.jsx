import React, { useState, useEffect, Fragment } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Minus, Plus } from "lucide-react";

import { Header } from "@/components/RoutineForm/Header";
import { PeriodCell } from "@/components/RoutineForm/PeriodCell";
import { devLog } from "@/utils/apiUtils";
import { useAlert } from "@/contexts/AlertContext";
import { Navbar } from "@/containers";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const subjects = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Computer Science",
];

export const allTeachers = [
  "Dr. Sarah Mitchell (Math)",
  "Prof. James Wilson (Physics)",
  "Ms. Emily Chen (English)",
  "Dr. Michael Roberts (Chemistry)",
  "Mrs. Lisa Anderson (Biology)",
  "Mr. David Thompson (History)",
  "Dr. Rachel Kumar (Geography)",
  "Mr. Alex Turner (CS)",
];

export const timeSlots = [
  "08:00 AM - 09:00 AM",
  "09:15 AM - 10:15 AM",
  "10:30 AM - 11:30 AM",
  "11:45 AM - 12:45 PM",
  "02:00 PM - 03:00 PM",
  "03:15 PM - 04:15 PM",
];

export const rooms = [
  "Room 101 (Science Lab)",
  "Room 102 (Computer Lab)",
  "Room 201 (Math Lab)",
  "Room 202 (Language Lab)",
  "Room 301 (General)",
  "Room 302 (General)",
  "Room 401 (Physics Lab)",
  "Room 402 (Chemistry Lab)",
];

export const existingSchedules = [
  {
    className: "Class 8A",
    schedule: [
      {
        period: 1,
        monday: {
          teacher: "Dr. Sarah Mitchell (Math)",
          subject: "Mathematics",
          time: "08:00 AM - 09:00 AM",
          room: "Room 201 (Math Lab)",
        },
        tuesday: {
          teacher: "Ms. Emily Chen (English)",
          subject: "English",
          time: "08:00 AM - 09:00 AM",
          room: "Room 202 (Language Lab)",
        },
      },
    ],
  },
];
function App() {
  const { showAlert } = useAlert();
  const [selectedClass, setSelectedClass] = useState("Class 8B");
  const [periodCount, setPeriodCount] = useState(8);

  if (periodCount > 9) {
    alert("Period Count cannot be more than 12");
    setPeriodCount(8);
  }
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      periods: Array(8).fill({
        monday: { subject: "", teacher: "", time: "", room: "" },
        tuesday: { subject: "", teacher: "", time: "", room: "" },
        wednesday: { subject: "", teacher: "", time: "", room: "" },
        thursday: { subject: "", teacher: "", time: "", room: "" },
        friday: { subject: "", teacher: "", time: "", room: "" },
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "periods",
  });

  useEffect(() => {
    reset({
      periods: Array(periodCount).fill({
        monday: { subject: "", teacher: "", time: "", room: "" },
        tuesday: { subject: "", teacher: "", time: "", room: "" },
        wednesday: { subject: "", teacher: "", time: "", room: "" },
        thursday: { subject: "", teacher: "", time: "", room: "" },
        friday: { subject: "", teacher: "", time: "", room: "" },
      }),
    });
  }, [periodCount, reset]);

  const formValues = watch();

  const getAvailableResources = (periodIndex, day) => {
    const timeSlot = formValues.periods[periodIndex]?.[day.toLowerCase()]?.time;

    const busyTeachers = existingSchedules.flatMap((schedule) => {
      const periodSchedule = schedule.schedule.find(
        (p) => p[day.toLowerCase()]?.time === timeSlot
      );
      return periodSchedule
        ? periodSchedule[day.toLowerCase()]?.teacher || ""
        : "";
    });

    const busyRooms = existingSchedules.flatMap((schedule) => {
      const periodSchedule = schedule.schedule.find(
        (p) => p[day.toLowerCase()]?.time === timeSlot
      );
      return periodSchedule
        ? periodSchedule[day.toLowerCase()]?.room || ""
        : "";
    });

    const availableTeachers = allTeachers.filter(
      (teacher) => !busyTeachers.includes(teacher)
    );
    const availableRooms = rooms.filter((room) => !busyRooms.includes(room));

    return { availableTeachers, availableRooms };
  };

  const onSubmit = (data) => {
    const hasEmptyFields = data.periods.some((period) =>
      Object.values(period).some((daySchedule) =>
        Object.values(daySchedule).some((value) => !value)
      )
    );

    if (hasEmptyFields) {
      alert("Please fill in all fields for each period and day.");
      return;
    }

    const transformedData = days.reduce((acc, day) => {
      const dayLower = day.toLowerCase();
      acc[dayLower] = data.periods.map((period) => ({
        subject: period[dayLower].subject,
        teacher: period[dayLower].teacher,
        time: period[dayLower].time,
        room: period[dayLower].room,
      }));
      return acc;
    }, {});
    devLog("transformed data", transformedData);
    showAlert("Routine making success");
    reset();
  };

  return (
    <Fragment>
      <Navbar />
      <div className="routine-container">
        <div className="routine-wrapper">
          <Header
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="routine-form"
            noValidate
          >
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    {days.map((day) => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, periodIndex) => (
                    <tr key={field.id}>
                      <td className="period-number">{periodIndex + 1}</td>
                      {days.map((day) => {
                        const dayLower = day.toLowerCase();
                        const { availableTeachers, availableRooms } =
                          getAvailableResources(periodIndex, day);

                        return (
                          <PeriodCell
                            key={`${field.id}-${day}`}
                            periodIndex={periodIndex}
                            day={day}
                            dayLower={dayLower}
                            register={register}
                            errors={errors}
                            availableTeachers={availableTeachers}
                            availableRooms={availableRooms}
                            subjects={subjects}
                            timeSlots={timeSlots}
                          />
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="submit-container">
              <button type="submit" className="submit-button">
                <Save size={20} />
                Save Class Schedule
              </button>
            </div>
          </form>
          <div className="adds-buttons">
            <button
              className="append-remove-button"
              onClick={() => setPeriodCount((prev) => prev + 1)}
            >
              <Plus size={16} />
            </button>
            <button
              className="append-remove-button remove"
              onClick={() => setPeriodCount((prev) => Math.max(1, prev - 1))}
            >
              <Minus size={16} />
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
