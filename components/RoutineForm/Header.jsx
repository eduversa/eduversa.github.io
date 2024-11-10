import React from "react";

export function Header({ selectedClass, setSelectedClass }) {
  const classChange = (e) => {
    setSelectedClass(e.target.value);
  };
  return (
    <div className="header">
      <div className="header-content">
        <h1>Create Routine</h1>
        
      </div>
      <div className="class-info">
        <span>Current Class:</span>
        <div className="select-container">
          <select
            onChange={classChange}
            value={selectedClass}
            className="select-field"
          >
            <option value={"Select a class"}>Select a class</option>
            <option value={"4A"}>4A</option>
            <option value={"4B"}>4B</option>
          </select>
        </div>
        {/* <span className="class-name">{selectedClass}</span> */}
      </div>
    </div>
  );
}
