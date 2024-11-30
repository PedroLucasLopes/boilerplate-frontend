import React from 'react'
import PropTypes from 'prop-types'
import { CCol } from '@coreui/react'

const Blob = ({ label, style = 'success' }) => {
  const stylePattern = {
    success: {
      color: 'green',
      style: 'active-status-active',
    },
    danger: {
      color: 'red',
      style: 'active-status-inactive',
    },
    warning: {
      color: 'yellow',
      style: 'active-status-warning',
    },
  }

  return (
    <CCol
      className="d-flex"
      style={{
        flexGrow: 0,
      }}
    >
      <div className={`blob ${stylePattern[style].color}`}></div>
      <span className={`mt-2 ${stylePattern[style].style}`}>{label}</span>
    </CCol>
  )
}

export default Blob

Blob.propTypes = {
  label: PropTypes.string,
  style: PropTypes.string,
}
