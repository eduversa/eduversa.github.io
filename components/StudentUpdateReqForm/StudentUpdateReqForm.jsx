import React, { useState, useEffect, Fragment } from 'react';
import {
  Text,
  Email,
  PhoneNumber,
  Pincode,
  Name,
  TextNoNumber,
} from '../ApplicantForm/inputComponent/InputComponent';
import AddressComponent from '../ApplicantForm/inputComponent/AddressComponent';

const StudentUpdateReqForm = ({ userid, userData }) => {
  const addressFields = {
    'personal_info.present_address': {
      label: 'Personal Info - Present Address',
      fields: ['street', 'pincode', 'city', 'district', 'state']
    },
    'personal_info.permanent_address': {
      label: 'Personal Info - Permanent Address',
      fields: ['street', 'pincode', 'city', 'district', 'state']
    },
    'family_info.guardian.office_address': {
      label: 'Family Info - Guardian - Office Address',
      fields: ['street', 'pincode', 'city', 'district', 'state']
    }
  };

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
      value: 'personal_info.present_address',
      label: 'Personal Info - Present Address',
      type: 'address',
    },
    {
      value: 'personal_info.permanent_address',
      label: 'Personal Info - Permanent Address',
      type: 'address',
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
      value: 'family_info.guardian.office_address',
      label: 'Family Info - Guardian - Office Address',
      type: 'address',
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
  const [pincodeErrors, setPincodeErrors] = useState({});
  const [consentDocument, setConsentDocument] = useState(null); 

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
    setPincodeErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleFieldSelect = (index, selectedValue) => {
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
      const selectedOption = initialOptions.find(opt => opt.value === selectedValue);
      
      updatedFields[index] = {
        ...currentField,
        field: selectedValue,
        oldValue: oldValue,
        newValue: selectedOption?.type === 'address' ? {
          street: '',
          pincode: '',
          city: '',
          district: '',
          state: ''
        } : '',
        type: selectedOption?.type,
        document: null
      };
      return updatedFields;
    });

    setAvailableOptions((prev) =>
      prev.filter((opt) => opt.value !== selectedValue)
    );
  };

  const handleValueChange = (index, value, subfield = null) => {
    setUpdateFields((prev) =>
      prev.map((field, i) => {
        if (i === index) {
          if (field.type === 'address') {
            return {
              ...field,
              newValue: {
                ...field.newValue,
                [subfield]: value
              }
            };
          }
          return { ...field, newValue: value };
        }
        return field;
      })
    );
  };
  
  const handleDocumentUpload = (index, file) => {
    setUpdateFields((prev) =>
      prev.map((field, i) => {
        if (i === index) {
          return { ...field, document: file };
        }
        return field;
      })
    );
  };
  
  const handleConsentDocumentUpload = (file) => {
    setConsentDocument(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (updateFields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    for (const field of updateFields) {
      if (field.type === 'address') {
        const addressConfig = addressFields[field.field];
        const hasEmptyFields = addressConfig.fields.some(subfield => 
          !field.newValue[subfield]
        );
        if (hasEmptyFields) {
          alert(`Please fill all address fields for ${getLabelByValue(field.field)}`);
          return;
        }
        
        if (!field.document) {
          alert(`Please upload a verification document for ${getLabelByValue(field.field)}`);
          return;
        }

      } else if (!field.newValue) {
        alert(`${getLabelByValue(field.field)} is empty`);
        return;
      }

      if (JSON.stringify(field.newValue) === JSON.stringify(field.oldValue)) {
        alert(`New value is same as the old value in ${getLabelByValue(field.field)}`);
        return;
      }
    }

    if (Object.values(pincodeErrors).some(error => error)) {
      alert('Please fix the pincode errors before submitting');
      return;
    }

    if (!consentDocument) {
      alert('Please upload the consent document before submitting');
      return;
    }

    const updatedData = {
      'fields': updateFields,
      'consent': consentDocument, 
    }
    if (process.env.NODE_ENV === 'development') {
      // console.log('Update Data:', updateFields, 'Consent Document:', consentDocument);
      console.log('Updated Data:', updatedData)
    }

    
    alert('Form submitted successfully');
  };

  const renderInput = (type, value, onChange, label, field = null, index) => {
    const props = {
      label: label || 'New Value',
      value: value || '',
      onChange: (e) => onChange(e.target.value),
      required: true,
    };

    switch (type) {
      case 'email':
        return <Email {...props} />;
      case 'phone':
        return <PhoneNumber {...props} />;
      case 'name':
        return <Name {...props} />;
      case 'address':
        if (!field) return null;
        return (
          <Fragment>
            <label className='address-label-main'>New Value:</label>
            <AddressComponent
              addressPath={`updateFields.${index}.newValue`}
              formData={{ updateFields }}
              handleChange={(e) => {
                const fieldName = e.target.name.split('.').pop();
                handleValueChange(index, e.target.value, fieldName);
              }}
              pincodeError={pincodeErrors[index]}
              setPincodeError={(error) => {
                setPincodeErrors(prev => ({
                  ...prev,
                  [index]: error
                }));
              }}
              required
            />
            <label>Upload Document for {getLabelByValue(field)}:</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleDocumentUpload(index, e.target.files[0])}
              required
            />
          </Fragment>
        );
      default:
        return <TextNoNumber {...props} />;
    }
  };

  return (
    <div className="form">
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
              <h4>{getLabelByValue(field.field)}</h4>
            )}

            {field.field && (
              <div>
                {field.type === 'address' ? (
                  <div className="address-fields-current">
                    <label className='address-label-main'>Current Value:</label>
                    <div className="address-component">
                      {addressFields[field.field].fields.map(subfield => (
                        <div key={subfield} className="address-sub-fields">
                          <label>{subfield.charAt(0).toUpperCase() + subfield.slice(1)}:</label>
                          <span className='old-values-address'>{field.oldValue[subfield] || 'Not set'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label>Current Value:</label>
                    <span className='old-values'>{field.oldValue || 'Not set'}</span>
                  </div>
                )}
                <div>
                  {renderInput(
                    field.type,
                    field.newValue,
                    (value, subfield) => handleValueChange(index, value, subfield),
                    'New Value',
                    field.field,
                    index
                  )}
                </div>
              </div>
            )}

            <button type="button" onClick={() => removeUpdateField(index)}>
              Remove
            </button>
          </div>
        ))}

        <div>
          <label>Upload Consent Document:</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleConsentDocumentUpload(e.target.files[0])}
            required
          />
        </div>
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