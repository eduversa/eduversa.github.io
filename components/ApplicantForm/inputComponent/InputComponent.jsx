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
      <label htmlFor={name}>{label}</label>
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
    <div htmlFor={name}>
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

export const PhoneNumber =({label, name, value, ...props}) =>{
  return (
    <div htmlFor={name}>
      <label>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        // pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
        pattern="^\+?[1-9][0-9]{7,14}$"
        {...props}
      />
    </div>
  )
}

export const Pincode =({label, name, value, ...props}) =>{
  return (
    <div htmlFor={name}>
      <label>{label}</label>
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
  )
}

export const Aadhar =({label, name, value, ...props}) =>{
  return (
    <div htmlFor={name}>
      <label>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$"
        {...props}
      />
    </div>
  )
}

export const Pan =({label, name, value, ...props}) =>{
  return (
    <div htmlFor={name}>
      <label>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
        {...props}
      />
    </div>
  )
}

export const DateInput =({label, name, value, ...props}) =>{
  return (
    <div>
      <label htmlFor={name}>{label}</label>
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
      <label htmlFor={name}>{label}</label>
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

// export const Checkbox =({label, name, value, options, ...props}) =>{
//   return (
//     <div>
//       {options.map((option) => {
//         return (
//           <div>
//             <label htmlFor={option.value}>{option.key}</label>
//             <input 
//               type="checkbox" 
//               id={name}
//               name={name}
//               value={value}
//               {...props}
//             />
//           </div>
//         );
//       })}
//     </div>
//   )
// }


export const Image =({label, name, imagePreview, handleFileInputChange}) => {
  return(
    <div className='image-upload'>
      {/* Image preview */}
      {imagePreview && (
        <div className="image-preview" >
          <img src={imagePreview} alt="Preview"/>
        </div>
      )}
      <label htmlFor="user-image" className="btn">{label}</label>
      {/* Input for file upload */}
      <input
        type="file"
        accept="image/*"
        name={name}
        id={name}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

    </div>
  )
}

