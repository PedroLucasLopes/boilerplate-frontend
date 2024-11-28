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

  const fillCharts = (metric) => {
    return data ? data['Metrics History'][metric] : savedData['Metrics History'][metric]
  }

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
                  {data ? data['CPU Usage'] : savedData['CPU Usage']}%&nbsp;
                  <span className="fs-6 fw-normal">
                    (Média:{' '}
                    {fillCharts('cpu_usage').reduce((acc, act) => acc + act) /
                      fillCharts('cpu_usage').length}
                    )
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
                    labels: fillCharts('cpu_usage').map((value) => `${value}%`),
                    datasets: [
                      {
                        label: 'Uso de CPU',
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: getStyle('--cui-primary'),
                        data: fillCharts('cpu_usage'),
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
                        min: Math.min(...fillCharts('cpu_usage')) - 10,
                        max: Math.max(...fillCharts('cpu_usage')) + 10,
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
                  {data ? data['Memory Usage'] : savedData['Memory Usage']}&nbsp;
                  <span className="fs-6 fw-normal">
                    (Memória Total: {data ? data['Total Memory'] : savedData['Total Memory']})
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
                    labels: fillCharts('memory_usage').map((value) => `${value} MB`),
                    datasets: [
                      {
                        label: 'Uso de Memória',
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: getStyle('--cui-info'),
                        data: fillCharts('memory_usage'),
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
                        min: Math.min(...fillCharts('memory_usage')) - 10,
                        max: Math.max(...fillCharts('memory_usage')) + 10,
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
                    (
                    {(
                      fillCharts('latency')[fillCharts('latency').length - 2] /
                      fillCharts('latency')[fillCharts('latency').length - 1]
                    ).toFixed(2)}{' '}
                    <CIcon icon={cilArrowTop} />)
                  </span>
                </>
              }
              title="Tempo de resposta (ms)"
              chart={
                <CChartLine
                  className="mt-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: fillCharts('latency').map((value) => `${value.toFixed(2)}ms`),
                    datasets: [
                      {
                        label: 'Latência',
                        backgroundColor: 'rgba(255,255,255,.2)',
                        borderColor: 'rgba(255,255,255,.55)',
                        data: fillCharts('latency').map((value) => value.toFixed(2)),
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
                        min: Math.min(...fillCharts('latency')) - 10,
                        max: Math.max(...fillCharts('latency')) + 10,
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
