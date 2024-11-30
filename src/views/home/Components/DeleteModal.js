import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter, CButton } from '@coreui/react'
import PropTypes from 'prop-types'

const DeleteModal = ({ deleteVm, visible, setVisible, handleDeleteVm }) => {
  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Deletar VM</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>{`Tem certeza que deseja deletar ${deleteVm.vm_name} (${deleteVm.ip})`}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Fechar
        </CButton>
        <CButton color="danger" onClick={handleDeleteVm}>
          Deletar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

DeleteModal.propTypes = {
  deleteVm: PropTypes.shape({
    vm_name: PropTypes.string,
    ip: PropTypes.string,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  handleDeleteVm: PropTypes.func.isRequired,
}

export default DeleteModal
