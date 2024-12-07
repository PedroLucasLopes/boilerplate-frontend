import React from 'react'
import { CSpinner } from '@coreui/react'
import switchBackground from '../utils/switchBackground'
import PropTypes from 'prop-types'

const LoadingContainer = ({ spinnerColor }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: '10rem',
        backgroundColor: switchBackground[spinnerColor],
        borderRadius: '5px',
      }}
    >
      <CSpinner color={spinnerColor} variant="grow" />
    </div>
  )
}

LoadingContainer.propTypes = {
  spinnerColor: PropTypes.string,
}

export default LoadingContainer
