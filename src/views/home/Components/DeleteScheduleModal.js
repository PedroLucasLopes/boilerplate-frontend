import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter, CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import formatBackupSchedule from '../../../utils/formatBackupSchedule'

const DeleteScheduleModal = ({ deleteSchedule, visible, setVisible, handleDeleteSchedule }) => {
  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Cancelar Agendamento</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>{`Tem certeza que deseja cancelar o agendamento ${deleteSchedule.job_id && formatBackupSchedule(deleteSchedule.job_id)} (${deleteSchedule.vm_ip})?`}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Fechar
        </CButton>
        <CButton color="danger" onClick={handleDeleteSchedule}>
          Cancelar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

DeleteScheduleModal.propTypes = {
  deleteSchedule: PropTypes.shape({
    vm_ip: PropTypes.string,
    job_id: PropTypes.string,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  handleDeleteSchedule: PropTypes.func.isRequired,
}

export default DeleteScheduleModal
