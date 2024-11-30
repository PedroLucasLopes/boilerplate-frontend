import React from 'react'
import classNames from 'classnames'

import { CCard, CCardBody, CCardFooter, CCol, CProgress, CRow, CSpinner } from '@coreui/react'

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

  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  return (
    <>
      <WidgetsDropdown
        metrics={metrics}
        fillCharts={fillCharts}
        loading={loading}
        monitorId={monitorId}
        className="mb-4"
      />
      {!loading ? (
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
          <CCardFooter>
            <CRow
              xs={{ cols: 1, gutter: 4 }}
              sm={{ cols: 2 }}
              lg={{ cols: 4 }}
              xl={{ cols: 5 }}
              className="mb-2 text-center"
            >
              {progressExample.map((item, index, items) => (
                <CCol
                  className={classNames({
                    'd-none d-xl-block': index + 1 === items.length,
                  })}
                  key={index}
                >
                  <div className="text-body-secondary">{item.title}</div>
                  <div className="fw-semibold text-truncate">
                    {item.value} ({item.percent}%)
                  </div>
                  <CProgress thin className="mt-2" color={item.color} value={item.percent} />
                </CCol>
              ))}
            </CRow>
          </CCardFooter>
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
      )}
    </>
  )
}

export default Dashboard
