import React, { useState, useRef, useEffect } from 'react';
import { Text, Pincode } from './InputComponent';
import fetchAddressFromPincode from './fetchAddressFromPincode';

const AddressComponent = ({
  label,
  addressPath,
  formData,
  handleChange,
  required = false,
  className = '',
  pincodeError,
  setPincodeError,
}) => {
  const [pincode, setPincode] = useState('');
  const [prevPincode, setPrevPincode] = useState('');
  const [fetching, setFetching] = useState(false);
  const controller = useRef(null);

  const getAddressValue = (field) => {
    const path = `${addressPath}.${field}`;
    return path.split('.').reduce((obj, key) => obj?.[key] ?? '', formData);
  };

  useEffect(() => {
    let isSubscribed = true;

    if (pincode.length === 6 && pincode !== prevPincode) {
      if (fetching) {
        controller.current?.abort();
      }
      setFetching(true);
      controller.current = new AbortController();

      fetchAddressFromPincode(
        formData,
        handleChange,
        addressPath,
        pincode,
        setPincodeError,
        controller.current
      ).then(() => {
        if (isSubscribed) {
          setFetching(false);
          setPrevPincode(pincode);
        }
      });
    }

    return () => {
      isSubscribed = false;
      controller.current?.abort();
    };
  }, [pincode, prevPincode, formData, handleChange, addressPath, setPincodeError, fetching]);

  return (
    <div className={`address-component ${className}`}>
      {label && <h4 className="sub-sub-heading">{label}</h4>}
      
      <Text
        label="Street"
        name={`${addressPath}.street`}
        value={getAddressValue('street')}
        onChange={handleChange}
        required={required}
      />

      <div className="grid-col-2">
        <Pincode
          label="Pincode"
          name={`${addressPath}.pincode`}
          value={getAddressValue('pincode')}
          onChange={(e) => {
            handleChange(e);
            if (e.target.value.length === 6) {
              setPincode(e.target.value);
              setPincodeError(false);
            }
          }}
          className={pincodeError ? 'invalid' : ''}
          required={required}
        />
        <Text
          label="City"
          name={`${addressPath}.city`}
          value={getAddressValue('city')}
          onChange={handleChange}
          required={required}
        />
      </div>

      <div className="grid-col-2">
        <Text
          label="District"
          name={`${addressPath}.district`}
          value={getAddressValue('district')}
          onChange={handleChange}
          required={required}
        />
        <Text
          label="State"
          name={`${addressPath}.state`}
          value={getAddressValue('state')}
          onChange={handleChange}
          required={required}
        />
      </div>
    </div>
  );
};

export default AddressComponent;