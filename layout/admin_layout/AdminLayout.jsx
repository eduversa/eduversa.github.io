import {AdminNavbar, Footer} from '@/containers'
import React, { Fragment } from 'react'

const AdminLayout = ({children}) => {
  return (
    <Fragment>
      <AdminNavbar></AdminNavbar>
      {children}
      <Footer></Footer>
    </Fragment>
  )
}

export default AdminLayout
