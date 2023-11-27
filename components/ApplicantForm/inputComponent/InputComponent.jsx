import React from "react";

export const Text = ({ label, details, name, value, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label} <span>{details}</span>
      </label>
      <input type="text" id={name} name={name} value={value} {...props} />
    </div>
  );
};

export const Email = ({ label, name, value, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>{label}</label>
      <input type="email" id={name} name={name} value={value} {...props} />
    </div>
  );
};

export const Number = ({ label, name, value, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>{label}</label>
      <input type="number" id={name} name={name} value={value} {...props} />
    </div>
  );
};

export const PhoneNumber = ({ label, name, value, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>{label}</label>
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
        {...props}
      />
    </div>
  );
};

export const Pincode = ({ label, name, value, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[1-9]{1}[0-9]{2}[0-9]{3}$"
        // pattern="^[1-9][0-9]{5}$"
        {...props}
      />
    </div>
  );
};

export const Aadhar = ({ label, name, value, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$"
        {...props}
      />
    </div>
  );
};

export const Pan = ({ label, name, value, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
        {...props}
      />
    </div>
  );
};

export const DateInput = ({ label, name, value, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>{label}</label>
      <input type="date" id={name} name={name} value={value} {...props} />
    </div>
  );
};

export const Select = ({ label, name, value, options, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} value={value} {...props}>
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

export const FormButtons = ({
  handlePreviousClick,
  clearFormData,
  onSubmitHandler,
  currentStep,
  totalSteps,
}) => {
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
      <button type="button" className="btn" onClick={onSubmitHandler}>
        Save
      </button>
      <button className="btn" type="submit">
        {currentStep === totalSteps ? "Submit" : "Next"}
      </button>
    </div>
  );
};
