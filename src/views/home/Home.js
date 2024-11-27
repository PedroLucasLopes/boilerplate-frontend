import React, { useCallback } from 'react'
import { CCard, CCardTitle, CCardText, CCardBody, CCardSubtitle, CCardFooter } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibPostgresql } from '@coreui/icons'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const vms = useSelector((state) => state.api)
  const navigate = useNavigate()

  const handleVMonitor = useCallback((id) => {
    try {
      window.localStorage.setItem('monitorId', id)
      navigate('/dashboard')
    } catch (e) {
      console.error(e)
    }
  })

  return (
    <>
      <h2>VMs Cadastradas</h2>
      <div className="border-top mb-3"></div>
      <div className="d-flex w-100 gap-3">
        {vms &&
          vms.map((vm, i) => {
            return (
              <CCard className="w-25 cursor-pointer" onClick={() => handleVMonitor(vm.id)} key={i}>
                <CCardBody>
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <CCardTitle>{vm.vm_name}</CCardTitle>
                    <CCardSubtitle className="mb-2 text-body-secondary">{vm.ip}</CCardSubtitle>
                  </div>
                  <div className="border-top"></div>
                  <div className="d-flex flex-column w-100 justify-content-evenly mt-2">
                    <div className="d-flex gap-2">
                      <span className="fw-bold">SSH:</span>
                      <CCardText>{vm.ssh_user}</CCardText>
                    </div>
                    <div className="d-flex gap-2">
                      <span className="fw-bold">User:</span>
                      <CCardText>{vm.pg_user}</CCardText>
                    </div>
                  </div>
                </CCardBody>
                <CCardFooter className="d-flex flex-row justify-content-between mb-3">
                  {vm.has_postgre && <CIcon icon={cibPostgresql} size="xl" />}
                  <CCardText>Port: {vm.port}</CCardText>
                </CCardFooter>
              </CCard>
            )
          })}
      </div>
    </>
  )
}

export default Home
