import React, { useCallback } from 'react'
import { CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter, CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import instance from '../../../api/instance'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DumpAllModal = ({ dumpAllVisible, setDumpAllVisible, metrics }) => {
  const encodedCredentials = JSON.parse(localStorage.getItem('reduxAuthState')).user
  const handleBackup = useCallback(async () => {
    try {
      const data = { ip: metrics['IP'] }
      const response = await instance.post('/dumpall', data, {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      })
      toast.success(response.data.message)
      setDumpAllVisible(false)
    } catch (e) {
      const errorMessage = e.response?.data?.detail || 'Failed to backup'
      toast.error(errorMessage)
    }
  }, [])

  return (
    <>
      <CModal
        visible={dumpAllVisible}
        onClose={() => setDumpAllVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">
            Fazer Dump de {metrics['Name']} ({metrics['IP']})
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Deseja confirmar o Dump?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDumpAllVisible(false)}>
            Fechar
          </CButton>
          <CButton color="warning" onClick={handleBackup}>
            Realizar Dump
          </CButton>
        </CModalFooter>
      </CModal>
      <ToastContainer />
    </>
  )
}

DumpAllModal.propTypes = {
  dumpAllVisible: PropTypes.bool.isRequired,
  setDumpAllVisible: PropTypes.func.isRequired,
  metrics: PropTypes.object,
}

export default DumpAllModal
