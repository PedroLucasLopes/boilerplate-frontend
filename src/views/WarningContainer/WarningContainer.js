import React from 'react'
import { CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CContainer } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'
import PropTypes from 'prop-types'

const WarningContainer = ({ title, description, text, color = 'primary' }) => {
  return (
    <CContainer className="d-flex justify-content-center align-items-center">
      <CCard className="text-center shadow-sm border-0" color={color} textColor="light">
        <CCardHeader>
          <CIcon icon={cilWarning} size="lg" className="text-warning me-2" />
          {title}
        </CCardHeader>
        {description ||
          (text && (
            <CCardBody>
              {description && <CCardTitle>{description}</CCardTitle>}
              {text && <CCardText>{text}</CCardText>}
            </CCardBody>
          ))}
      </CCard>
    </CContainer>
  )
}

WarningContainer.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
}

export default WarningContainer
