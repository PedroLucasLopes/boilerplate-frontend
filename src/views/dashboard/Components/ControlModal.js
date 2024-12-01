import React, { useCallback } from 'react'
import { CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter, CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import instance from '../../../api/instance'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ControlModal = ({ controlVisible, setControlVisible, metrics }) => {
  const encodedCredentials = JSON.parse(localStorage.getItem('reduxAuthState')).user
  const handleBackup = useCallback(async () => {
    try {
      const data = { ip: metrics['IP'], action: '' }
      const response = await instance.post('/control', data, {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      })
      toast.success(response.data.message)
      setControlVisible(false)
    } catch (e) {
      const errorMessage = e.response?.data?.detail || 'Failed to backup'
      toast.error(errorMessage)
    }
  }, [encodedCredentials, metrics, setControlVisible])

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
          <CButton color="danger" onClick={handleBackup}>
            Realizar Controle
          </CButton>
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
