import React from 'react'
import PropTypes from 'prop-types'

const Blob = ({ color = 'green' }) => {
  return <div className={`blob ${color}`}></div>
}

export default Blob

Blob.propTypes = {
  color: PropTypes.string,
}
