import React, { useCallback, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CButton,
  CFormSelect,
} from '@coreui/react'
import PropTypes from 'prop-types'
import instance from '../../../api/instance'
import { toast, ToastContainer } from 'react-toastify'
import token from '../../../utils/token'

const BackupModal = ({ backupVisible, setBackupVisible, metrics }) => {
  const [backupVm, setBackUpVm] = useState({ ip: metrics['IP'], database: 'postgre' })
  const existentVms = JSON.parse(sessionStorage.getItem('reduxApiState')) || []
  const handleBackup = useCallback(async () => {
    try {
      const response = await instance.post('/backup', backupVm, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
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
          <div className="d-flex justify-content-between align-items-center gap-3">
            <CFormSelect
              value={backupVm && backupVm.ip}
              onChange={(e) => setBackUpVm((prev) => ({ ...prev, ip: e.target.value }))}
              aria-label="VM Select Input"
            >
              {existentVms
                .filter((vm) => vm['port'] !== null)
                .map((vm, i) => (
                  <option value={vm['IP']} key={i}>
                    {vm.vm_name} ({vm.ip})
                  </option>
                ))}
            </CFormSelect>
            {metrics['databases'].length > 0 && (
              <CFormSelect
                value={backupVm && backupVm.database}
                onChange={(e) =>
                  setBackUpVm((prev) => ({ ...prev, database: Number(e.target.value) }))
                }
                aria-label="VM Select Input"
              >
                {metrics['databases'].map((database, i) => (
                  <option value={database} key={i}>
                    {database}
                  </option>
                ))}
              </CFormSelect>
            )}
          </div>
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
