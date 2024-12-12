import React, { useCallback, useState, useEffect } from 'react'
import {
  CCard,
  CCardTitle,
  CCardText,
  CCardBody,
  CCardSubtitle,
  CCardFooter,
  CButton,
} from '@coreui/react'
import { cilTrash, cilPlus, cibPostgresql } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setId } from '../../hooks/useObservable'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { setApiData } from '../../store/apiReducer'
import CIcon from '@coreui/icons-react'
import instance from '../../api/instance'
import DeleteModal from './Components/DeleteModal'
import DeleteScheduleModal from './Components/DeleteScheduleModal'
import NewVmModal from './Components/NewVmModal'
import token from '../../utils/token'
import useGetListBackup from '../../hooks/useGetListBackup'
import Blob from '../../components/Blob'
import formatBackupSchedule from '../../utils/formatBackupSchedule'
import WarningContainer from '../WarningContainer/WarningContainer'
import Pagination from '../../components/Pagination'
import useGetVms from '../../hooks/useGetVms'
import { setPagination } from '../../store/paginationReducer'
import LoadingContainer from '../../components/LoadingContainer'

const Home = () => {
  const dispatch = useDispatch()
  const { getVms, loading } = useGetVms()

  const vms = useSelector((state) => state.api)
  const pagination = useSelector((state) => state.pag)

  const [visible, setVisible] = useState(false)
  const [visibleSchedule, setVisibleSchedule] = useState(false)
  const [visibleNew, setVisibleNew] = useState(false)

  const [deleteVm, setDeleteVm] = useState({})
  const [deleteSchedule, setDeleteSchedule] = useState({})

  const { data: scheduledBackups, setData: setScheduledBackups } = useGetListBackup()

  const savedBackups = JSON.parse(sessionStorage.getItem('scheduled_backups')) || []
  const schedules = scheduledBackups || savedBackups

  const handleDeleteVm = useCallback(async () => {
    try {
      await instance.delete(`/vms/${deleteVm.id}`, {
        headers: {
          Authorization: `Basic ${token()}`,
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

  const handleDeleteSchedule = useCallback(async () => {
    try {
      const response = await instance.delete(`/remove_backup/${deleteSchedule.job_id}`, {
        headers: {
          Authorization: `Basic ${token()}`,
        },
      })
      toast.success(response.data.message)
      setVisibleSchedule(false)
      setScheduledBackups((prev) => ({
        ...prev,
        scheduled_backups: prev.scheduled_backups.filter(
          (backup) => backup.job_id !== deleteSchedule.job_id,
        ),
      }))
    } catch (e) {
      const errorMessage = e.response?.data?.detail || 'Failed to delete schedule'
      toast.error(errorMessage)
    }
  })

  const handlePageChange = (page) => {
    dispatch(setPagination({ ...pagination, page }))
    getVms(token, page)
  }

  useEffect(() => {
    JSON.parse(sessionStorage.getItem('reduxApiState')) === null && getVms(token)
  }, [getVms])

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
        {!loading ? (
          vms &&
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
          ))
        ) : (
          <LoadingContainer />
        )}
        <Pagination
          page={pagination.page}
          total_pages={pagination.total_pages}
          onPageChange={handlePageChange}
        />
      </div>
      <div className="d-flex justify-content-between mb-2 mt-2">
        <h2>Backups Agendados</h2>
        {/* <CButton
          color="primary"
          onClick={() => setVisibleNew(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', width: '12rem' }}
        >
          <div className="mr-2">
            <CIcon icon={cilPlus} />
          </div>
          Cadastrar Nova VM
        </CButton> */}
      </div>
      <div className="border-top mb-3"></div>
      {schedules.scheduled_backups && schedules.scheduled_backups.length > 0 ? (
        <div className="row g-3">
          {schedules.scheduled_backups.map((backup) => (
            <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={backup.job_id}>
              <CCard className="h-100">
                <CCardBody>
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <CCardTitle>{formatBackupSchedule(backup.job_id)}</CCardTitle>
                    <CCardSubtitle className="mb-2 text-body-secondary">
                      {backup.vm_ip}
                    </CCardSubtitle>
                  </div>
                  <div className="border-top"></div>
                </CCardBody>
                <CCardFooter className="d-flex flex-row align-items-center justify-content-between">
                  {backup.status === 'agendado' ? (
                    <Blob label={backup.status} style="success" />
                  ) : (
                    <Blob label={backup.status} style="danger" />
                  )}
                  <CIcon
                    icon={cilTrash}
                    size="lg"
                    className="cursor-pointer"
                    onClick={() => {
                      setVisibleSchedule(true)
                      setDeleteSchedule(backup)
                    }}
                  />
                </CCardFooter>
              </CCard>
            </div>
          ))}
        </div>
      ) : (
        <WarningContainer title="Não há Backups agendados no momento!" color="transparent" />
      )}
      <DeleteModal
        deleteVm={deleteVm}
        visible={visible}
        setVisible={setVisible}
        handleDeleteVm={handleDeleteVm}
      />
      <DeleteScheduleModal
        deleteSchedule={deleteSchedule}
        visible={visibleSchedule}
        setVisible={setVisibleSchedule}
        handleDeleteSchedule={handleDeleteSchedule}
      />
      <NewVmModal visibleNew={visibleNew} setVisibleNew={setVisibleNew} />
      <ToastContainer />
    </>
  )
}

export default Home
