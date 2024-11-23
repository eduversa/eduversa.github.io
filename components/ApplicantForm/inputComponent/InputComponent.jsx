import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

//restriction funtions
const preventE = (e) => {
  if (e.key === "e" || e.key === "E") {
    e.preventDefault();
  }
};
const preventSpace = (e) => {
  if (e.key === " ") {
    e.preventDefault();
  }
};
const onlyNumber = (e) => {
  if (
    !/[0-9]/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key) &&
    !(e.ctrlKey || e.metaKey)
  ) {
    e.preventDefault();
  }
};
const onlyNumberWithSpace = (e) => {
  if (
    !/[0-9]/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", " "].includes(e.key) &&
    !(e.ctrlKey || e.metaKey)
  ) {
    e.preventDefault();
  }
};
const onlyLetters = (e) => {
  if (
    !/[a-zA-Z.]/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", " "].includes(e.key) &&
    !(e.ctrlKey || e.metaKey)
  ) {
    e.preventDefault();
  }
};
export const Text = ({ label, details, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label} <span>{details}</span>
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        required={required}
        {...props}
      />
    </div>
  );
};

export const TextNoNumber = ({
  label,
  details,
  name,
  value,
  required,
  ...props
}) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label} <span>{details}</span>
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onKeyDown={onlyLetters}
        required={required}
        {...props}
      />
    </div>
  );
};
export const Name = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label} <span>(Example: Ankur Halder)</span>
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="[^\s]+(?:\s[^\s]+){1,}"
        onKeyDown={onlyLetters}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Email = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="email"
        id={name}
        name={name}
        value={value}
        // pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        pattern="[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}"
        minLength={6}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Number = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onKeyDown={onlyNumber}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Year = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        onKeyDown={preventE}
        onInput={(e) => {
          e.target.value = Math.max(0, parseInt(e.target.value))
            .toString()
            .slice(0, 4);
        }}
        required={required}
        {...props}
      />
    </div>
  );
};

export const PhoneNumber = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        // pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
        // pattern="^\+?[1-9][0-9]{7,14}$"
        // pattern="^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$"
        // pattern="^\+?\d{1,3}\s?\d{1,14}$"
        pattern="^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$"
        onKeyDown={onlyNumber}
        maxLength={10}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Pincode = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label} <span>(Example: 700140)</span>
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[1-9]{1}[0-9]{2}[0-9]{3}$"
        // pattern="^[1-9][0-9]{5}$"
        onKeyDown={onlyNumber}
        maxLength={6}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Aadhar = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label} <span>(Example: 2653 8564 4663)</span>
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$"
        onKeyDown={onlyNumberWithSpace}
        maxLength={14}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Pan = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label} <span>(Example: ABCTY1234D)</span>
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
        onKeyDown={preventSpace}
        minLength={10}
        maxLength={10}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Dob = ({ label, name, value, required = false, ...props }) => {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() - 15);
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 100);
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        min={minDate.toISOString().split("T")[0]}
        max={maxDate.toISOString().split("T")[0]}
        required={required}
        {...props}
      />
    </div>
  );
};

export const DateInput = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Select = ({ label, name, value, options, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label}
        {props.required && <span style={{ color: "red" }}>*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        required={required}
        {...props}
      >
        {options.map((option) => {
          return (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export const SubjectMarks2 = ({ name, marks, handleChange, ...props }) => {
  const [subjectsMarks, setSubjectsMarks] = useState(
    marks || [{ subject: "", mark: "" }]
  );

  const handleSubjectMarkChange = (e, index, field) => {
    const { value } = e.target;
    const newSubjectsMarks = { ...subjectsMarks };
    const keys = Object.keys(newSubjectsMarks);
    const subject = keys[index];

    if (field === "subject") {
      const newKey = value.trim();
      if (newKey !== subject) {
        newSubjectsMarks[newKey] = newSubjectsMarks[subject];
        delete newSubjectsMarks[subject];
      }
    } else if (field === "mark") {
      newSubjectsMarks[subject] = value;
    }

    setSubjectsMarks(newSubjectsMarks);
    handleChange({ target: { name, value: newSubjectsMarks } });
  };

  const handleAddSubjectMark = () => {
    const subjectsMarksArray = Object.entries(subjectsMarks).map(
      ([subject, mark]) => ({ subject, mark })
    );
    const newSubjectsMarksArray = [
      ...subjectsMarksArray,
      { subject: "", mark: "" },
    ];
    const newSubjectsMarks = Object.fromEntries(
      newSubjectsMarksArray.map(({ subject, mark }) => [subject, mark])
    );
    setSubjectsMarks(newSubjectsMarks);
  };

  const handleDeleteSubjectMark = (index) => {
    const subjectsMarksArray = Object.entries(subjectsMarks).map(
      ([subject, mark]) => ({ subject, mark })
    );
    const newSubjectsMarksArray = subjectsMarksArray.filter(
      (_, i) => i !== index
    );
    const newSubjectsMarks = Object.fromEntries(
      newSubjectsMarksArray.map(({ subject, mark }) => [subject, mark])
    );
    setSubjectsMarks(newSubjectsMarks);
  };

  return (
    <div>
      <label htmlFor={name}>
        Subject Marks
        {props.required && <span style={{ color: "red" }}>*</span>}
      </label>
      {Object.entries(subjectsMarks).map(([subject, mark], index) => (
        <div key={index} className="grid-col-2-5">
          <input
            type="text"
            name="subject"
            value={subject}
            onChange={(e) => handleSubjectMarkChange(e, index, "subject")}
            placeholder="Subject"
            required
          />
          <input
            type="text"
            name="mark"
            value={mark}
            onChange={(e) => handleSubjectMarkChange(e, index, "mark")}
            placeholder="Mark"
            onKeyDown={onlyNumber}
            required
          />
          <div className="btns">
            <button
              type="button"
              className="small-btn"
              onClick={() => handleDeleteSubjectMark(index)}
            >
              -
            </button>
          </div>
        </div>
      ))}
      <div className="btns">
        <button
          type="button"
          className="small-btn"
          onClick={handleAddSubjectMark}
        >
          +
        </button>
      </div>
    </div>
  );
};

export const SubjectMarks1 = ({ name, marks, handleChange, ...props }) => {
  const [subjectsMarks, setSubjectsMarks] = useState(
    marks
      ? Object.entries(marks).map(([subject, mark]) => ({ subject, mark }))
      : [{ subject: "", mark: "" }]
  );

  const handleSubjectMarkChange = (e, index, field) => {
    const { value } = e.target;
    const newSubjectsMarks = [...subjectsMarks];
    newSubjectsMarks[index][field] = value;
    setSubjectsMarks(newSubjectsMarks);
    const marksObject = newSubjectsMarks.reduce(
      (acc, { subject, mark }) => ({ ...acc, [subject]: mark }),
      {}
    );
    handleChange({ target: { name, value: marksObject } });
  };

  const handleAddSubjectMark = () => {
    setSubjectsMarks([...subjectsMarks, { subject: "", mark: "" }]);
  };

  const handleDeleteSubjectMark = (index) => {
    const newSubjectsMarks = subjectsMarks.filter((_, i) => i !== index);
    setSubjectsMarks(newSubjectsMarks);
    const marksObject = newSubjectsMarks.reduce(
      (acc, { subject, mark }) => ({ ...acc, [subject]: mark }),
      {}
    );
    handleChange({ target: { name, value: marksObject } });
  };

  return (
    <div>
      <label htmlFor={name}>
        Subject Marks
        {props.required && <span style={{ color: "red" }}>*</span>}
      </label>
      {subjectsMarks.map((item, index) => (
        <div key={index} className="grid-col-2-5">
          <input
            type="text"
            name="subject"
            value={item.subject}
            onChange={(e) => handleSubjectMarkChange(e, index, "subject")}
            onKeyDown={onlyLetters}
            placeholder="Subject"
            required
          />
          <input
            type="text"
            name="mark"
            value={item.mark}
            onChange={(e) => handleSubjectMarkChange(e, index, "mark")}
            placeholder="Mark"
            pattern="^(100|[0-9]{1,2})$"
            maxLength={3}
            onKeyDown={onlyNumber}
            required
          />
          <div className="btns">
            <button
              type="button"
              className="small-btn"
              onClick={() => handleDeleteSubjectMark(index)}
            >
              -
            </button>
          </div>
        </div>
      ))}
      <div className="btns">
        <button
          type="button"
          className="small-btn"
          onClick={handleAddSubjectMark}
        >
          +
        </button>
      </div>
    </div>
  );
};

export const SubjectMarks3 = ({ name, marks, handleChange, ...props }) => {
  const [subjectsMarks, setSubjectsMarks] = useState(
    marks
      ? Object.entries(marks).map(([subject, mark]) => ({ subject, mark }))
      : [{ subject: "", mark: "" }]
  );
  const [aggregate, setAggregate] = useState(0);

  const handleSubjectMarkChange = (e, index, field) => {
    const { value } = e.target;
    const newSubjectsMarks = [...subjectsMarks];

    // Update the respective field
    newSubjectsMarks[index][field] = value;

    // Validate marks: ensure it’s a number between 0 and 100
    if (field === "mark") {
      const markValue = Math.max(0, Math.min(100, parseFloat(value) || 0)); // Clamp value between 0 and 100
      newSubjectsMarks[index][field] = markValue;
    }

    setSubjectsMarks(newSubjectsMarks);

    // Create marks object
    const marksObject = newSubjectsMarks.reduce(
      (acc, { subject, mark }) => ({ ...acc, [subject]: mark }),
      {}
    );

    // Trigger change to parent
    handleChange({ target: { name, value: marksObject } });

    // Calculate aggregate
    calculateAggregate(newSubjectsMarks);
  };

  const calculateAggregate = (subjectsMarks) => {
    const totalMarks = subjectsMarks.reduce(
      (acc, { mark }) => acc + (parseFloat(mark) || 0),
      0
    );
    const totalSubjects = subjectsMarks.length;
    const newAggregate =
      totalSubjects > 0 ? (totalMarks / totalSubjects).toFixed(2) : 0;
    setAggregate(newAggregate);
    handleChange({
      target: { name: `${name}.aggregate`, value: newAggregate },
    }); // Update aggregate in parent
  };

  const handleAddSubjectMark = () => {
    setSubjectsMarks([...subjectsMarks, { subject: "", mark: "" }]);
  };

  const handleDeleteSubjectMark = (index) => {
    const newSubjectsMarks = subjectsMarks.filter((_, i) => i !== index);
    setSubjectsMarks(newSubjectsMarks);
    const marksObject = newSubjectsMarks.reduce(
      (acc, { subject, mark }) => ({ ...acc, [subject]: mark }),
      {}
    );
    handleChange({ target: { name, value: marksObject } });
    calculateAggregate(newSubjectsMarks);
  };

  return (
    <div>
      <label htmlFor={name}>
        Subject Marks
        {props.required && <span style={{ color: "red" }}>*</span>}
      </label>
      {subjectsMarks.map((item, index) => (
        <div key={index} className="grid-col-2-5">
          <input
            type="text"
            name="subject"
            value={item.subject}
            onChange={(e) => handleSubjectMarkChange(e, index, "subject")}
            placeholder="Subject"
            required
          />
          <input
            type="number"
            name="mark"
            value={item.mark}
            onChange={(e) => handleSubjectMarkChange(e, index, "mark")}
            placeholder="Mark"
            min={0}
            max={100}
            required
          />
          <div className="btns">
            <button
              type="button"
              className="small-btn"
              onClick={() => handleDeleteSubjectMark(index)}
            >
              -
            </button>
          </div>
        </div>
      ))}
      <div className="btns">
        <button
          type="button"
          className="small-btn"
          onClick={handleAddSubjectMark}
        >
          +
        </button>
      </div>
      <div>
        <strong>Aggregate: {aggregate}</strong>
      </div>
    </div>
  );
};

export const SubjectMarks = ({ name, marks, handleChange, ...props }) => {
  const [subjectsMarks, setSubjectsMarks] = useState(
    marks
      ? Object.entries(marks).map(([subject, mark]) => ({ subject, mark }))
      : [{ subject: "", mark: "" }]
  );
  const [aggregate, setAggregate] = useState(0);
  const baseName = name.split(".").slice(0, -1).join(".");

  const handleSubjectMarkChange = (e, index, field) => {
    const { value } = e.target;
    const newSubjectsMarks = [...subjectsMarks];
    newSubjectsMarks[index][field] = value;
    setSubjectsMarks(newSubjectsMarks);
    const marksObject = newSubjectsMarks.reduce(
      (acc, { subject, mark }) => ({ ...acc, [subject]: mark }),
      {}
    );
    handleChange({ target: { name, value: marksObject } });
    calculateAggregate(newSubjectsMarks);
  };

  const calculateAggregate = (subjectsMarks) => {
    const totalMarks = subjectsMarks.reduce(
      (acc, { mark }) => acc + (parseFloat(mark) || 0),
      0
    );
    const totalSubjects = subjectsMarks.length;
    const newAggregate = totalSubjects > 0 ? totalMarks : 0;
    setAggregate(newAggregate);
    handleChange({
      target: { name: `${baseName}.aggregate`, value: newAggregate },
    });
  };

  useEffect(() => {
    calculateAggregate(subjectsMarks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectsMarks]);

  const handleAddSubjectMark = () => {
    setSubjectsMarks([...subjectsMarks, { subject: "", mark: "" }]);
  };

  const handleDeleteSubjectMark = (index) => {
    const newSubjectsMarks = subjectsMarks.filter((_, i) => i !== index);
    setSubjectsMarks(newSubjectsMarks);
    const marksObject = newSubjectsMarks.reduce(
      (acc, { subject, mark }) => ({ ...acc, [subject]: mark }),
      {}
    );
    handleChange({ target: { name, value: marksObject } });
    calculateAggregate(newSubjectsMarks);
  };

  return (
    <div>
      <label htmlFor={name}>
        Subject Marks
        {props.required && <span style={{ color: "red" }}>*</span>}
      </label>
      {subjectsMarks.map((item, index) => (
        <div key={index} className="grid-col-2-5">
          <input
            type="text"
            name="subject"
            value={item.subject}
            onChange={(e) => handleSubjectMarkChange(e, index, "subject")}
            placeholder="Subject"
            required
          />
          <input
            type="text"
            name="mark"
            value={item.mark}
            onChange={(e) => handleSubjectMarkChange(e, index, "mark")}
            placeholder="Mark out of 100"
            pattern="^(100|[0-9]{1,2})$"
            maxLength={3}
            onKeyDown={onlyNumber}
            required
          />
          <div className="btns">
            <button
              type="button"
              className="small-btn"
              onClick={() => handleDeleteSubjectMark(index)}
            >
              -
            </button>
          </div>
        </div>
      ))}
      <div className="btns">
        <button
          type="button"
          className="small-btn"
          onClick={handleAddSubjectMark}
        >
          +
        </button>
      </div>
      <div>
        <label htmlFor={`${baseName}.aggregate`}>Aggregate</label>
        <input type="text" value={aggregate} readonly />
      </div>
    </div>
  );
};

export const FormButtons = ({
  handlePreviousClick,
  clearFormData,
  onSubmitHandler,
  currentStep,
  totalSteps,
}) => {
  const router = useRouter();
  const handleSaveClick = () => {
    const userType = localStorage.getItem("userType");
    onSubmitHandler();
    // if (userType === "admin") {
    //   router.push("/admin/manage/applicants/profile");
    // }
  };

  return (
    <div className="btns">
      <button
        type="button"
        className="btn"
        onClick={handlePreviousClick}
        disabled={currentStep === 1}
        // style={{opacity: isPrevDisabled ? 0.3 : 1}}
      >
        Prev
      </button>
      <button type="button" className="btn" onClick={clearFormData}>
        Clear
      </button>
      <button type="button" className="btn" onClick={handleSaveClick}>
        Save
      </button>
      <button className="btn" type="submit">
        {currentStep === totalSteps ? "Submit" : "Next"}
      </button>
    </div>
  );
};
