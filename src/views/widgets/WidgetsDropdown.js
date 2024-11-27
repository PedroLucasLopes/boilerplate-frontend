import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { CRow, CCol, CWidgetStatsA, CFormSelect } from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop } from '@coreui/icons'
import { setId } from '../../hooks/useObservable'

const WidgetsDropdown = ({ data, monitorId, className }) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  const existentVms = JSON.parse(sessionStorage.getItem('reduxApiState'))
  const savedData = JSON.parse(sessionStorage.getItem('monitor'))

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <>
      <CRow className={className} xs={{ gutter: 4 }}>
        <CFormSelect
          value={monitorId || ''}
          onChange={(e) => {
            const id = Number(e.target.value)
            setId(id) // Atualiza o Observable
          }}
          aria-label="VM Select Input"
        >
          <option value="" defaultValue>
            Selecione uma VM
          </option>
          {existentVms &&
            existentVms.map((vm, i) => (
              <option value={vm.id} key={i}>
                {vm.vm_name} ({vm.ip})
              </option>
            ))}
        </CFormSelect>
      </CRow>
      {(data || savedData) && (
        <CRow className={className} xs={{ gutter: 4 }}>
          <CCol sm={6} xl={4} xxl={4}>
            <CWidgetStatsA
              color="primary"
              value={
                <>
                  {data ? data['CPU Usage'] : savedData['CPU Usage']}
                  <span className="fs-6 fw-normal">
                    (-12.4% <CIcon icon={cilArrowBottom} />)
                  </span>
                </>
              }
              title="Uso da CPU"
              chart={
                <CChartLine
                  ref={widgetChartRef1}
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        label: 'My First dataset',
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: getStyle('--cui-primary'),
                        data: [65, 59, 84, 84, 51, 55, 40],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        border: {
                          display: false,
                        },
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        min: 30,
                        max: 89,
                        display: false,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 1,
                        tension: 0.4,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
          <CCol sm={6} xl={4} xxl={4}>
            <CWidgetStatsA
              color="info"
              value={
                <>
                  {data ? data['Memory Usage'] : savedData['Memory Usage']}
                  <span className="fs-6 fw-normal">
                    (40.9% <CIcon icon={cilArrowTop} />)
                  </span>
                </>
              }
              title="Uso de Memória"
              chart={
                <CChartLine
                  ref={widgetChartRef2}
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        label: 'My First dataset',
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: getStyle('--cui-info'),
                        data: [1, 18, 9, 17, 34, 22, 11],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        border: {
                          display: false,
                        },
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        min: -9,
                        max: 39,
                        display: false,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 1,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
          <CCol sm={6} xl={4} xxl={4}>
            <CWidgetStatsA
              color="warning"
              value={
                <>
                  {data ? data['Response Time'] : savedData['Response Time']}
                  <span className="fs-6 fw-normal">
                    (84.7% <CIcon icon={cilArrowTop} />)
                  </span>
                </>
              }
              title="Tempo de resposta (ms)"
              chart={
                <CChartLine
                  className="mt-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,255,255,.2)',
                        borderColor: 'rgba(255,255,255,.55)',
                        data: [78, 81, 80, 45, 34, 12, 40],
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        display: false,
                      },
                      y: {
                        display: false,
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 2,
                        tension: 0.4,
                      },
                      point: {
                        radius: 0,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
        </CRow>
      )}
    </>
  )
}

WidgetsDropdown.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  monitorId: PropTypes.number,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
