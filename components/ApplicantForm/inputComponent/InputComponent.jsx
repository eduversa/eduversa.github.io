import React from 'react'

export const Text =({label, name, value, ...props}) =>{
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        {...props}
      />
    </div>
  )
}

export const Email =({label, name, value, ...props}) =>{
  return (
    <div>
      <label>{label}</label>
      <input
        type="email"
        id={name}
        name={name}
        value={value}
        {...props}
      />
    </div>
  )
}

export const Number =({label, name, value, ...props}) =>{
  return (
    <div>
      <label>{label}</label>
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        {...props}
      />
    </div>
  )
}

export const DateInput =({label, name, value, ...props}) =>{
  return (
    <div>
      <label>{label}</label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        {...props}
      />
    </div>
  )
}

export const Select =({label, name, value, options, ...props}) =>{
  return (
    <div>
      <label>{label}</label>
      <select
        id={name}
        name={name}
        value={value}
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
  )
}



