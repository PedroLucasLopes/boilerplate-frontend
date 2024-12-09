import React, { useEffect } from 'react'

import { CCard, CCardBody, CCol, CRow, CSpinner } from '@coreui/react'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import useMonitor from '../../hooks/useMonitor'

import switchBackground from '../../utils/switchBackground'
import WarningContainer from '../WarningContainer/WarningContainer'

import useGetVms from '../../hooks/useGetVms'

import token from '../../utils/token'

const Dashboard = () => {
  const { getVms } = useGetVms()
  const monitorId = Number(localStorage.getItem('monitorId'))
  const { data, loading } = useMonitor(monitorId)
  const savedData = JSON.parse(sessionStorage.getItem('monitor')) || {}
  const metrics = data || savedData

  const fillCharts = (metric) => metrics?.['Metrics History']?.[metric] || []

  useEffect(() => {
    JSON.parse(sessionStorage.getItem('reduxApiState')) === null && getVms(token())
  }, [getVms])

  return (
    <>
      <WidgetsDropdown
        metrics={metrics}
        fillCharts={fillCharts}
        loading={loading}
        monitorId={monitorId}
        className="mb-4"
      />
      {Object.keys(metrics).length > 0 &&
        (!loading ? (
          !metrics['Error'] ? (
            <CCard className="mb-4">
              <CCardBody>
                <CRow>
                  <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                      Informações do Banco
                    </h4>
                    <div className="small text-body-secondary">Últimos Minutos</div>
                  </CCol>
                </CRow>
                <MainChart fillCharts={fillCharts} />
              </CCardBody>
            </CCard>
          ) : (
            <WarningContainer
              title={'Não encontramos nenhum dado!'}
              description={`Sem dados disponíveis em ${metrics['Name']} (${metrics['IP']})`}
              text={'Parece que essa VM não tem dados para serem exibidos.'}
              color="danger"
            />
          )
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              height: '20rem',
              backgroundColor: switchBackground['light'],
              borderRadius: '5px',
              marginTop: '2rem',
            }}
          >
            <CSpinner color="light" variant="grow" />
          </div>
        ))}
    </>
  )
}

export default Dashboard
