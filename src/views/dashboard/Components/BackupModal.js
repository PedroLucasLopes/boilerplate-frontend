import React, { useCallback } from 'react'
import { CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter, CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import instance from '../../../api/instance'
import { toast, ToastContainer } from 'react-toastify'
import token from '../../../utils/token'
import 'react-toastify/dist/ReactToastify.css'

const BackupModal = ({ backupVisible, setBackupVisible, metrics }) => {
  const handleBackup = useCallback(async () => {
    try {
      const response = await instance.post(
        '/backup',
        { ip: metrics['IP'], database: 'postgre' },
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        },
      )
      toast.success(response.data.message)
      setBackupVisible(false)
    } catch (e) {
      const errorMessage = e.response?.data?.detail || 'Failed to backup'
      toast.error(errorMessage)
    }
  }, [])

  return (
    <>
      <CModal
        visible={backupVisible}
        onClose={() => setBackupVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">
            Fazer Backup de {metrics['Name']} ({metrics['IP']})
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Deseja confirmar o backup?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setBackupVisible(false)}>
            Fechar
          </CButton>
          <CButton color="primary" onClick={handleBackup}>
            Realizar Backup
          </CButton>
        </CModalFooter>
      </CModal>
      <ToastContainer />
    </>
  )
}

BackupModal.propTypes = {
  backupVisible: PropTypes.bool.isRequired,
  setBackupVisible: PropTypes.func.isRequired,
  metrics: PropTypes.object,
}

export default BackupModal
