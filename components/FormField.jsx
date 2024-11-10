import React from 'react';

export default function FormField({ label, icon: Icon, error, children }) {
  return (
    <div className="form__group">
      <label className="form__label">
        <Icon size={16} />
        {label}
      </label>
      {children}
      {error && <p className="form__error">{error}</p>}
    </div>
  );
}