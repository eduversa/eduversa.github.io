import React, { useState, useEffect } from 'react';
import {
  Text,
  Email,
  PhoneNumber,
  Pincode,
  Name,
  TextNoNumber,
} from '../ApplicantForm/inputComponent/InputComponent';

const StudentUpdateReqForm = ({ userid, userData }) => {
  const initialOptions = [
    {
      value: 'personal_info.email',
      label: 'Personal Info - Email',
      type: 'email',
    },
    {
      value: 'personal_info.contact',
      label: 'Personal Info - Contact',
      type: 'phone',
    },
    {
      value: 'personal_info.present_address.street',
      label: 'Personal Info - Present Address - Street',
      type: 'text',
    },
    {
      value: 'personal_info.present_address.pincode',
      label: 'Personal Info - Present Address - Pincode',
      type: 'pincode',
    },
    {
      value: 'personal_info.present_address.city',
      label: 'Personal Info - Present Address - City',
      type: 'text',
    },
    {
      value: 'personal_info.present_address.district',
      label: 'Personal Info - Present Address - District',
      type: 'text',
    },
    {
      value: 'personal_info.present_address.state',
      label: 'Personal Info - Present Address - State',
      type: 'text',
    },
    {
      value: 'personal_info.permanent_address.street',
      label: 'Personal Info - Permanent Address - Street',
      type: 'text',
    },
    {
      value: 'personal_info.permanent_address.pincode',
      label: 'Personal Info - Permanent Address - Pincode',
      type: 'pincode',
    },
    {
      value: 'personal_info.permanent_address.city',
      label: 'Personal Info - Permanent Address - City',
      type: 'text',
    },
    {
      value: 'personal_info.permanent_address.district',
      label: 'Personal Info - Permanent Address - District',
      type: 'text',
    },
    {
      value: 'personal_info.permanent_address.state',
      label: 'Personal Info - Permanent Address - State',
      type: 'text',
    },
    {
      value: 'family_info.father.email',
      label: "Family Info - Father's Email",
      type: 'email',
    },
    {
      value: 'family_info.father.contact',
      label: "Family Info - Father's Contact",
      type: 'phone',
    },
    {
      value: 'family_info.mother.email',
      label: "Family Info - Mother's Email",
      type: 'email',
    },
    {
      value: 'family_info.mother.contact',
      label: "Family Info - Mother's Contact",
      type: 'phone',
    },
    {
      value: 'family_info.guardian.name',
      label: "Family Info - Guardian's Name",
      type: 'name',
    },
    {
      value: 'family_info.guardian.email',
      label: "Family Info - Guardian's Email",
      type: 'email',
    },
    {
      value: 'family_info.guardian.contact',
      label: "Family Info - Guardian's Contact",
      type: 'phone',
    },
    {
      value: 'family_info.guardian.relation',
      label: "Family Info - Guardian's Relation",
      type: 'text',
    },
    {
      value: 'family_info.guardian.occupation',
      label: "Family Info - Guardian's Occupation",
      type: 'text',
    },
    {
      value: 'family_info.guardian.designation',
      label: "Family Info - Guardian's Designation",
      type: 'text',
    },
    {
      value: 'family_info.guardian.office_contact',
      label: "Family Info - Guardian's Office Contact",
      type: 'phone',
    },
    {
      value: 'family_info.guardian.income',
      label: "Family Info - Guardian's Income",
      type: 'text',
    },
    {
      value: 'family_info.guardian.office_address.street',
      label: 'Family Info - Guardian - Office Address - Street',
      type: 'text',
    },
    {
      value: 'family_info.guardian.office_address.pincode',
      label: 'Family Info - Guardian - Office Address - Pincode',
      type: 'pincode',
    },
    {
      value: 'family_info.guardian.office_address.city',
      label: 'Family Info - Guardian - Office Address - City',
      type: 'text',
    },
    {
      value: 'family_info.guardian.office_address.district',
      label: 'Family Info - Guardian - Office Address - District',
      type: 'text',
    },
    {
      value: 'family_info.guardian.office_address.state',
      label: 'Family Info - Guardian - Office Address - State',
      type: 'text',
    },
  ];

  const labelMap = initialOptions.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

  const getLabelByValue = (value) => {
    return labelMap[value] || 'Label not found';
  };

  const [updateFields, setUpdateFields] = useState([]);
  const [availableOptions, setAvailableOptions] = useState(initialOptions);

  const getNestedValue = (obj, path) => {
    try {
      return path
        .split('.')
        .reduce(
          (acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''),
          obj || {}
        );
    } catch (error) {
      console.error('Error getting nested value:', error);
      return '';
    }
  };

  const addUpdateField = () => {
    if (availableOptions.length === 0) return;

    const newField = {
      field: '',
      newValue: '',
      oldValue: '',
    };

    setUpdateFields((prev) => [...prev, newField]);
  };

  const removeUpdateField = (index) => {
    const fieldToRemove = updateFields[index];
    if (fieldToRemove && fieldToRemove.field) {
      const optionToRestore = initialOptions.find(
        (opt) => opt.value === fieldToRemove.field
      );
      if (optionToRestore) {
        setAvailableOptions((prev) => {
          if (!prev.some((opt) => opt.value === optionToRestore.value)) {
            const originalIndex = initialOptions.findIndex(
              (opt) => opt.value === optionToRestore.value
            );
            const newOptions = [...prev];
            newOptions.splice(originalIndex, 0, optionToRestore);
            return newOptions;
          }
          return prev;
        });
      }
    }
    setUpdateFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldSelect = (index, selectedValue) => {
    // console.log(index, selectedValue)
    setUpdateFields((prevFields) => {
      const updatedFields = [...prevFields];
      const currentField = updatedFields[index];

      if (currentField.field) {
        const optionToRestore = initialOptions.find(
          (opt) => opt.value === currentField.field
        );
        if (optionToRestore) {
          setAvailableOptions((prev) =>
            [...prev, optionToRestore].sort((a, b) =>
              a.label.localeCompare(b.label)
            )
          );
        }
      }

      const oldValue = getNestedValue(userData, selectedValue);
      updatedFields[index] = {
        ...currentField,
        field: selectedValue,
        oldValue: oldValue,
        newValue: '',
      };
      return updatedFields;
    });

    setAvailableOptions((prev) =>
      prev.filter((opt) => opt.value !== selectedValue)
    );
  };

  // useEffect(() => {
  //   console.log("UpdateFields:", updateFields);
  //   console.log("AvailableOptions:", availableOptions);
  // }, [updateFields, availableOptions]);

  const handleValueChange = (index, value) => {
    setUpdateFields((prev) =>
      prev.map((field, i) =>
        i === index ? { ...field, newValue: value } : field
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (updateFields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    for (const field of updateFields) {
      if (!field.newValue) {
        alert(`${getLabelByValue(field.field)} is empty`);
        return;
      }
      if (field.newValue === field.oldValue) {
        alert(`New value is same as the old value in ${getLabelByValue(field.field)}`);
        return;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Update Data:', updateFields);
    }

    alert('Form submitted successfully');
  };

  const renderInput = (type, value, onChange, label) => {
    const props = {
      label: label || 'New Value',
      value: value || '',
      onChange: (e) => onChange(e.target.value),
      required: true
    };

    switch (type) {
      case 'email':
        return <Email {...props} />;
      case 'phone':
        return <PhoneNumber {...props} />;
      case 'pincode':
        return <Pincode {...props} />;
      case 'name':
        return <Name {...props} />;
      default:
        return <TextNoNumber {...props} />;
    }
  };

  // useEffect(() => {
  //   if (updateFields.length === 0) {
  //     addUpdateField();
  //   }
  // }, []);

  return (
    <div className='form'>
      <h2>Update Request Form</h2>
      <form onSubmit={handleSubmit} className="student_update_form">
        {updateFields.map((field, index) => (
          <div key={index}>
            {!field.field ? (
              <select
                onChange={(e) => handleFieldSelect(index, e.target.value)}
                required
              >
                <option value="">Select field to update</option>
                {availableOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <h4>
                {/* {initialOptions.find(option => option.value === field.field)?.label || field.field} */}
                {getLabelByValue(field.field)}
              </h4>
            )}

            {field.field && (
              <div>
                <div>
                  <label>Current Value:</label>
                  <span>{field.oldValue || 'Not set'}</span>
                </div>
                <div>
                  {renderInput(
                    initialOptions.find((opt) => opt.value === field.field)
                      ?.type,
                    field.newValue,
                    (value) => handleValueChange(index, value),
                    'New Value'
                  )}
                </div>
              </div>
            )}

            <button type="button" onClick={() => removeUpdateField(index)}>
              Remove
            </button>
          </div>
        ))}

        <div className="form-actions">
          <button
            type="button"
            onClick={addUpdateField}
            disabled={availableOptions.length === 0}
          >
            Add
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default StudentUpdateReqForm;
