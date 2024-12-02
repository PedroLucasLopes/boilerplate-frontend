import React, { useCallback, useState } from 'react'
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
  CSpinner,
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
import useIpMask from '../../../hooks/useIpMask'
import { ToastContainer, toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import instance from '../../../api/instance'
import 'react-toastify/dist/ReactToastify.css'
import formatCreateError from '../../../utils/formatCreateError'
import token from '../../../utils/token'
import { setApiData } from '../../../store/apiReducer'

const NewVmModal = ({ visibleNew, setVisibleNew }) => {
  const dispatch = useDispatch()
  const vms = useSelector((state) => state.api)
  const [newVm, setNewVm] = useState({})
  const [hasPostgre, setHasPostgre] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { ipMask } = useIpMask()

  const handleIpChange = (field, value) => {
    const formattedValue = ipMask(value)
    setNewVm((prev) => ({ ...prev, [field]: formattedValue }))
  }

  const handleCreateVm = useCallback(async () => {
    try {
      setIsLoading(true) // Ativa o estado de carregamento.
      const response = await instance.post(
        '/vms',
        { ...newVm, has_postgre: hasPostgre },
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        },
      )
      const createdVm = response.data // Assumindo que a resposta retorna a nova VM criada.
      dispatch(setApiData([...vms, createdVm])) // Adiciona a nova VM ao estado.
      setVisibleNew(false) // Fecha o modal depois de criado
    } catch (error) {
      let errorMessage = 'Failed to create VM'
      if (Array.isArray(error.response?.data?.detail)) {
        // Cria uma lista de campos ausentes, com cada campo em negrito.
        const missingFields = error.response.data.detail.map(
          (err) => formatCreateError[err.loc?.slice(1)],
        )
        errorMessage = (
          <div>
            <p>Os seguintes campos estão ausentes ou inválidos:</p>
            <ul>
              {missingFields.map((field, index) => (
                <li key={index}>
                  <strong>{field}</strong>
                </li>
              ))}
            </ul>
          </div>
        )
      }
      toast.error(errorMessage) // Exibe a mensagem com a lista formatada
    } finally {
      setIsLoading(false) // Desativa o estado de carregamento.
    }
  }, [newVm, setVisibleNew, hasPostgre, token, vms, dispatch])

  return (
    <>
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
              <CFormInput
                placeholder="Nome da VM"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, vm_name: e.target.value }))
                }}
                required
              />
              <CInputGroupText style={{ marginLeft: '1rem' }}>
                <CIcon icon={cilLocationPin} />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="IP"
                value={newVm.ip || ''}
                onChange={(e) => handleIpChange('ip', e.target.value)}
                required
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cibSuperuser} />
              </CInputGroupText>
              <CFormInput
                placeholder="Usuário SSH"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, ssh_user: e.target.value }))
                }}
                required
              />
              <CInputGroupText style={{ marginLeft: '1rem' }}>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Senha SSH"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, ssh_password: e.target.value }))
                }}
                style={{ marginRight: '1rem' }}
                required
              />
              <CFormCheck
                className="mt-2"
                label="PostgreSQL"
                checked={hasPostgre}
                onChange={() => setHasPostgre(!hasPostgre)}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cibPostgresql} />
              </CInputGroupText>
              <CFormInput
                placeholder="Usuário PostgreSQL"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, pg_user: e.target.value }))
                }}
                disabled={hasPostgre ? false : true}
              />
              <CInputGroupText style={{ marginLeft: '1rem' }}>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Senha PostgreSQL"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, pg_password: e.target.value }))
                }}
                style={{ marginRight: '1rem' }}
                disabled={hasPostgre ? false : true}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilLocationPin} />
              </CInputGroupText>
              <CFormInput
                placeholder="IP Storage"
                value={newVm.ip_storage || ''}
                onChange={(e) => handleIpChange('ip_storage', e.target.value)}
                required
              />
              <CInputGroupText style={{ marginLeft: '1rem' }}>
                <CIcon icon={cilUser} />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="SSH User Storage"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, ssh_user_storage: e.target.value }))
                }}
                style={{ marginRight: '1rem' }}
                required
              />
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Senha SSH Storage"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, ssh_password_storage: e.target.value }))
                }}
                style={{ marginRight: '1rem' }}
                required
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilUser} />
              </CInputGroupText>
              <CFormInput
                placeholder="Usuário Backup"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, user_pg: e.target.value }))
                }}
                required
              />
              <CInputGroupText style={{ marginLeft: '1rem' }}>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Senha Backup"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, password_pg: e.target.value }))
                }}
                style={{ marginRight: '1rem' }}
                required
              />
              <CInputGroupText>
                <CIcon icon={cilDoor} />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Porta"
                onBlur={(e) => {
                  setNewVm((prev) => ({ ...prev, port: e.target.value }))
                }}
                style={{ marginRight: '1rem' }}
                required
              />
            </CInputGroup>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleNew(false)}>
            Fechar
          </CButton>
          {!isLoading ? (
            <CButton color="primary" onClick={handleCreateVm}>
              Cadastrar
            </CButton>
          ) : (
            <CButton color="primary" disabled>
              <CSpinner color="light" size="sm" style={{ marginRight: '.4rem' }} />
              Criando
            </CButton>
          )}
        </CModalFooter>
      </CModal>
      <ToastContainer />
    </>
  )
}

NewVmModal.propTypes = {
  visibleNew: PropTypes.bool.isRequired,
  setVisibleNew: PropTypes.func.isRequired,
}

export default NewVmModal
