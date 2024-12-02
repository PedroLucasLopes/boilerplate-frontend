import React, { useCallback } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CButton,
  CButtonGroup,
} from '@coreui/react'
import PropTypes from 'prop-types'
import instance from '../../../api/instance'
import { toast, ToastContainer } from 'react-toastify'
import token from '../../../utils/token'

const ControlModal = ({ controlVisible, setControlVisible, metrics }) => {
  const handleBackup = useCallback(
    async (control) => {
      try {
        const response = await instance.post(
          '/control',
          { ip: metrics['IP'], action: control },
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          },
        )
        toast.success(response.data.message)
        setControlVisible(false)
      } catch (e) {
        const errorMessage = e.response?.data?.detail || 'Failed to backup'
        toast.error(errorMessage)
      }
    },
    [token, metrics, setControlVisible],
  )

  return (
    <>
      <CModal
        visible={controlVisible}
        onClose={() => setControlVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">
            Controlar PostgreSQL de {metrics['Name']} ({metrics['IP']})
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Fazer controle do PostgreSQL</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setControlVisible(false)}>
            Fechar
          </CButton>
          <div className="d-flex gap-1">
            <CButton
              color="success"
              onClick={() => handleBackup('start')}
              disabled={metrics['PostgreSQL Status'] === 'active' ? true : false}
            >
              Start
            </CButton>
            <CButton
              color="danger"
              onClick={() => handleBackup('stop')}
              disabled={metrics['PostgreSQL Status'] !== 'active' ? true : false}
            >
              Stop
            </CButton>
            <CButton color="warning" onClick={() => handleBackup('restart')}>
              Restart
            </CButton>
          </div>
        </CModalFooter>
      </CModal>
      <ToastContainer />
    </>
  )
}

ControlModal.propTypes = {
  controlVisible: PropTypes.bool.isRequired,
  setControlVisible: PropTypes.func.isRequired,
  metrics: PropTypes.object,
}

export default ControlModal
