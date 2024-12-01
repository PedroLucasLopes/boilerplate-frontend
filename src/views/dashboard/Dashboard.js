import React from 'react'
import classNames from 'classnames'

import { CCard, CCardBody, CCol, CRow, CSpinner } from '@coreui/react'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import useMonitor from '../../hooks/useMonitor'

import switchBackground from '../../utils/switchBackground'

const Dashboard = () => {
  const monitorId = Number(localStorage.getItem('monitorId'))
  const { data, loading } = useMonitor(monitorId)
  const savedData = JSON.parse(sessionStorage.getItem('monitor')) || {}
  const metrics = data || savedData

  const fillCharts = (metric) => metrics?.['Metrics History']?.[metric] || []

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
