import React, { useCallback, useState } from 'react'
import {
  CCard,
  CCardTitle,
  CCardText,
  CCardBody,
  CCardSubtitle,
  CCardFooter,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CButton,
} from '@coreui/react'
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { cibPostgresql } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setId } from '../../hooks/useObservable'
import { useNavigate } from 'react-router-dom'
import instance from '../../api/instance'
import { toast, ToastContainer } from 'react-toastify'
import { setApiData } from '../../store/apiReducer'

const Home = () => {
  const [visible, setVisible] = useState(false)
  const [deleteVm, setDeleteVm] = useState({})

  const dispatch = useDispatch()
  const vms = useSelector((state) => state.api)
  const encodedCredentials = JSON.parse(localStorage.getItem('reduxAuthState')).user

  const handleDeleteVm = useCallback(async () => {
    try {
      await instance.delete(`/vms/${deleteVm.id}`, {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      })
      // Atualizar a lista de VMs removendo a VM deletada
      dispatch(setApiData(vms.filter((vm) => vm.id !== deleteVm.id)))
      setVisible(false)
    } catch (e) {
      toast.error(`Erro ao deletar a VM: ${e}`)
    }
  }, [deleteVm, dispatch, vms])

  const navigate = useNavigate()

  return (
    <>
      <h2>VMs Cadastradas</h2>
      <div className="border-top mb-3"></div>
      <div className="row g-3">
        {vms &&
          vms.map((vm, i) => (
            <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={i}>
              <CCard className="w-100">
                <CCardBody
                  onClick={() => {
                    setId(vm.id)
                    navigate('/dashboard')
                  }}
                  className="cursor-pointer"
                >
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <CCardTitle>{vm.vm_name}</CCardTitle>
                    <CCardSubtitle className="mb-2 text-body-secondary">{vm.ip}</CCardSubtitle>
                  </div>
                  <div className="border-top"></div>
                  <div className="d-flex flex-column w-100 justify-content-evenly mt-2 gap-1">
                    <div className="d-flex gap-2">
                      <span className="fw-bold">SSH:</span>
                      <CCardText>{vm.ssh_user}</CCardText>
                    </div>
                    <div className="d-flex gap-2">
                      <span className="fw-bold">User:</span>
                      <CCardText>{vm.pg_user}</CCardText>
                    </div>
                    <div className="d-flex gap-2">
                      <span className="fw-bold">Port:</span>
                      <CCardText>{vm.port}</CCardText>
                    </div>
                  </div>
                </CCardBody>
                <CCardFooter className="d-flex flex-row justify-content-between mb-3">
                  {vm.has_postgre && <CIcon icon={cibPostgresql} size="xl" />}
                  <CIcon
                    icon={cilTrash}
                    size="lg"
                    className="cursor-pointer"
                    onClick={() => {
                      setVisible(true)
                      setDeleteVm(vm)
                    }}
                  />
                </CCardFooter>
              </CCard>
            </div>
          ))}
        <ToastContainer />
      </div>

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
    </>
  )
}

export default Home
