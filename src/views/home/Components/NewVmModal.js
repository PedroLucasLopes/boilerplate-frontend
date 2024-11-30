import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CForm,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLocationPin,
  cilUser,
  cibSuperuser,
  cilLockLocked,
  cibPostgresql,
  cilDoor,
} from '@coreui/icons'
import PropTypes from 'prop-types'

const NewVmModal = ({ visibleNew, setVisibleNew }) => {
  const [hasPostgres, setHasPostgres] = useState(true)
  return (
    <CModal
      visible={visibleNew}
      onClose={() => setVisibleNew(false)}
      aria-labelledby="LiveDemoExampleLabel"
      size="xl"
    >
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Cadastrar Nova VM</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <p className="text-body-secondary">Cadastrar nova VM no sistema</p>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput placeholder="Nome da VM" onBlur={() => {}} />
            <CInputGroupText style={{ marginLeft: '1rem' }}>
              <CIcon icon={cilLocationPin} />
            </CInputGroupText>
            <CFormInput type="text" placeholder="IP" onBlur={() => {}} />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cibSuperuser} />
            </CInputGroupText>
            <CFormInput placeholder="Usuário SSH" onBlur={() => {}} />
            <CInputGroupText style={{ marginLeft: '1rem' }}>
              <CIcon icon={cilLockLocked} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="Senha SSH"
              onBlur={() => {}}
              style={{ marginRight: '1rem' }}
            />
            <CFormCheck
              className="mt-2"
              label="PostgreSQL"
              checked={hasPostgres}
              onChange={(e) => setHasPostgres(e.target.value)}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cibPostgresql} />
            </CInputGroupText>
            <CFormInput
              placeholder="Usuário PostgreSQL"
              onBlur={() => {}}
              disabled={hasPostgres ? false : true}
            />
            <CInputGroupText style={{ marginLeft: '1rem' }}>
              <CIcon icon={cilLockLocked} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="Senha PostgreSQL"
              onBlur={() => {}}
              style={{ marginRight: '1rem' }}
              disabled={hasPostgres ? false : true}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilLocationPin} />
            </CInputGroupText>
            <CFormInput placeholder="IP Storage" onBlur={() => {}} />
            <CInputGroupText style={{ marginLeft: '1rem' }}>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="SSH User Storage"
              onBlur={() => {}}
              style={{ marginRight: '1rem' }}
            />
            <CInputGroupText>
              <CIcon icon={cilLockLocked} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="Senha SSH Storage"
              onBlur={() => {}}
              style={{ marginRight: '1rem' }}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput placeholder="Usuário Backup" onBlur={() => {}} />
            <CInputGroupText style={{ marginLeft: '1rem' }}>
              <CIcon icon={cilLockLocked} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="Senha Backup"
              onBlur={() => {}}
              style={{ marginRight: '1rem' }}
            />
            <CInputGroupText>
              <CIcon icon={cilDoor} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Porta"
              onBlur={() => {}}
              style={{ marginRight: '1rem' }}
            />
          </CInputGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisibleNew(false)}>
          Fechar
        </CButton>
        <CButton color="primary">Cadastrar</CButton>
      </CModalFooter>
    </CModal>
  )
}

NewVmModal.propTypes = {
  visibleNew: PropTypes.bool.isRequired,
  setVisibleNew: PropTypes.func.isRequired,
}

export default NewVmModal
