import React, { useCallback, useState } from 'react'
import {
  CCard,
  CCardTitle,
  CCardText,
  CCardBody,
  CCardSubtitle,
  CCardFooter,
  CButton,
} from '@coreui/react'
import { cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { cibPostgresql } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setId } from '../../hooks/useObservable'
import { useNavigate } from 'react-router-dom'
import instance from '../../api/instance'
import { toast, ToastContainer } from 'react-toastify'
import { setApiData } from '../../store/apiReducer'
import DeleteModal from './Components/DeleteModal'
import NewVmModal from './Components/NewVmModal'
import token from '../../utils/token'
import 'react-toastify/dist/ReactToastify.css'

const Home = () => {
  const [visible, setVisible] = useState(false)
  const [visibleNew, setVisibleNew] = useState(false)
  const [deleteVm, setDeleteVm] = useState({})

  const dispatch = useDispatch()
  const vms = useSelector((state) => state.api)

  const handleDeleteVm = useCallback(async () => {
    try {
      await instance.delete(`/vms/${deleteVm.id}`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
      // Atualizar a lista de VMs removendo a VM deletada
      dispatch(setApiData(vms.filter((vm) => vm.id !== deleteVm.id)))
      sessionStorage.removeItem('monitor')
      setVisible(false)
    } catch (e) {
      toast.error(`Erro ao deletar a VM: ${e}`)
    }
  }, [deleteVm, dispatch, vms])

  const navigate = useNavigate()

  return (
    <>
      <div className="d-flex justify-content-between mb-2">
        <h2>VMs Cadastradas</h2>
        <CButton
          color="primary"
          onClick={() => setVisibleNew(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', width: '12rem' }}
        >
          <div className="mr-2">
            <CIcon icon={cilPlus} />
          </div>
          Cadastrar Nova VM
        </CButton>
      </div>
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
      <DeleteModal
        deleteVm={deleteVm}
        visible={visible}
        setVisible={setVisible}
        handleDeleteVm={handleDeleteVm}
      />
      <NewVmModal visibleNew={visibleNew} setVisibleNew={setVisibleNew} />
    </>
  )
}

export default Home
