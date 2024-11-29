import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/layout'
import { devLog } from '@/utils/apiUtils'

const allPermissions = {
  super_duper_cr: 'Super Duper Class Representative',
  cr: 'Class Representative',
  super_cr: 'Super Class Representative',
}

const assignedPermissions = {
  cr: 'Class Representative',
}

function ManagePermissions() {
  const [assigned, setAssigned] = useState(assignedPermissions)
  const [available, setAvailable] = useState({})

  useEffect(() => {
    const availablePermissions = Object.keys(allPermissions).reduce((acc, key) => {
      if (!assigned[key]) {
        acc[key] = allPermissions[key]
      }
      return acc
    }, {})
    setAvailable(availablePermissions)
  }, [assigned])

  const handleAddPermission = (key) => {
    const newAssigned = { ...assigned, [key]: allPermissions[key] }
    const newAvailable = { ...available }
    delete newAvailable[key]

    setAssigned(newAssigned)
    setAvailable(newAvailable)
  }

  const handleRemovePermission = (key) => {
    const newAssigned = { ...assigned }
    delete newAssigned[key]
    
    const newAvailable = { ...available, [key]: allPermissions[key] }

    setAssigned(newAssigned)
    setAvailable(newAvailable)
  }

  const handleSubmit = () => {
    devLog('Assigned Permissions:', assigned)
  }

  return (
    <AdminLayout>
      <div className="manage-permissions">
        <div className="permissions-container">
          <div className="permissions-section">
            <h3>Available Permissions</h3>
            <ul>
              {Object.keys(available).map((key) => (
                <li key={key} className="permission-item">
                  <span>{available[key]}</span>
                  <button onClick={() => handleAddPermission(key)} className="btn btn-add">+</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="permissions-section">
            <h3>Assigned Permissions</h3>
            <ul>
              {Object.keys(assigned).map((key) => (
                <li key={key} className="permission-item">
                  <span>{assigned[key]}</span>
                  <button onClick={() => handleRemovePermission(key)} className="btn btn-remove">-</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="submit-container">
          <button onClick={handleSubmit} className="btn btn-submit">
            Confirm
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ManagePermissions