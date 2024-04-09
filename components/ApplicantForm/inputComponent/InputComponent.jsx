import React from "react";

//restriction funtions
const preventE = (e) => {
  if (e.key === 'e' || e.key === 'E') {
    e.preventDefault();
  }
};
const preventSpace = (e) => {
  if (e.key === ' ') {
    e.preventDefault();
  }
};
const onlyNumber = (e) => {
  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !(e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
};
const onlyNumberWithSpace = (e) => {
  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && !(e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
};
const onlyLetters = (e) => {
  if (!/[a-zA-Z]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && !(e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
};
export const Text = ({ label, details, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label} <span>{details}</span>
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input 
        type="text" 
        id={name} 
        name={name} 
        value={value} 
        {...props} />
    </div>
  );
};

export const Name = ({ label, name, value, required, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label} <span>(Example: Ankur Halder)</span>
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input 
        type="text" 
        id={name} 
        name={name} 
        value={value}
        onKeyDown={onlyLetters}
        {...props} />
    </div>
  );
};

export const Email = ({ label, name, value, required,  ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input 
        type="email" 
        id={name} 
        name={name} 
        value={value} 
        // pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        minLength={6}
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
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onKeyDown={onlyNumber}
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
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input 
        type="number" 
        id={name} 
        name={name} 
        value={value}
        onKeyDown={preventE}
        onInput={(e) => {
          e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
        }}
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
        {required && <span style={{ color: 'red' }}>*</span>}
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
        {required && <span style={{ color: 'red' }}>*</span>}
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
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input      
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$"
        onKeyDown={onlyNumberWithSpace}
        maxLength={14}
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
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
        onKeyDown={preventSpace}
        maxLength={10}
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
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input type="date" id={name} name={name} value={value} {...props} />
    </div>
  );
};

export const Select = ({ label, name, value, options, ...props }) => {
  return (
    <div className="inputs">
      <label htmlFor={name}>
        {label}
        {props.required && <span style={{ color: 'red' }}>*</span>}
      </label>
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
