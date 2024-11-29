// components/WidgetsDropdown.jsx
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { CRow, CFormSelect, CWidgetStatsB, CCol, CFormSwitch } from '@coreui/react'
import MetricWidget from '../../components/metricWidget'
import { chartOptions, lineStyles } from '../../utils/chartConfig'
import { getStyle } from '@coreui/utils'
import { setId } from '../../hooks/useObservable'
import Blob from '../../components/Blob'

const calculateAverage = (values) =>
  (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)

const WidgetsDropdown = ({ data, monitorId, className }) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const widgetChartRef3 = useRef(null)

  const existentVms = JSON.parse(sessionStorage.getItem('reduxApiState')) || []
  const savedData = JSON.parse(sessionStorage.getItem('monitor')) || {}

  const metrics = data || savedData

  useEffect(() => {
    const updateChartColors = () => {
      if (widgetChartRef1.current) {
        widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
        widgetChartRef1.current.update()
      }

      if (widgetChartRef2.current) {
        widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
        widgetChartRef2.current.update()
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', updateChartColors)
    return () =>
      document.documentElement.removeEventListener('ColorSchemeChange', updateChartColors)
  }, [])

  const fillCharts = (metric) => metrics?.['Metrics History']?.[metric] || []

  const formatCpuUsage = fillCharts('cpu_usage').map((value) => Number(value?.replace('%', '')))
  const diskSpacePercentageFormat =
    (Number(metrics['Free Disk Space']?.replace(/(G|T|MB|KB|B)/i, '')) /
      Number(metrics['Total Disk Space']?.replace(/(G|T|MB|KB|B)/i, ''))) *
    100
  const activeConnectionsPercentageFormat =
    (Number(metrics['Active Connections']) / Number(metrics['Max Connections'])) * 100

  return (
    <>
      <CRow className={className}>
        <CFormSelect
          value={monitorId || ''}
          onChange={(e) => setId(Number(e.target.value))}
          aria-label="VM Select Input"
        >
          <option value="" readOnly defaultValue>
            Selecione uma VM
          </option>
          {existentVms.map((vm, i) => (
            <option value={vm.id} key={i}>
              {vm.vm_name} ({vm.ip})
            </option>
          ))}
        </CFormSelect>
      </CRow>
      {metrics && (
        <>
          <CRow className="d-flex justify-content-between align-items-center mb-3">
            <CCol className="d-flex align-items-center">
              <CFormSwitch
                size="xl"
                label="Mudar Automaticamente"
                id="formSwitchCheckDefaultXL"
                style={{ width: '3rem', marginRight: '.5rem' }}
              />
            </CCol>
            {metrics['PostgreSQL Status'] === 'active' ? (
              <CCol className="d-flex align-items-center">
                <span className="active-status-active">ON</span>
                <Blob />
              </CCol>
            ) : (
              <CCol className="d-flex align-items-center">
                <span className="active-status-inactive">OFF</span>
                <Blob color="red" />
              </CCol>
            )}
          </CRow>
          <CRow className={className} xs={{ gutter: 4 }}>
            <MetricWidget
              title="Uso da CPU"
              color="primary"
              value={
                <>
                  {metrics['CPU Usage']}&nbsp;
                  <span className="fs-6 fw-normal">
                    (Média: {calculateAverage(formatCpuUsage)}%)
                  </span>
                </>
              }
              chartData={{
                labels: fillCharts('cpu_usage'),
                datasets: [
                  {
                    label: 'Uso de CPU',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: formatCpuUsage,
                    ...lineStyles.default,
                  },
                ],
              }}
              chartOptions={chartOptions(
                Math.min(...formatCpuUsage) * 0.9,
                Math.max(...formatCpuUsage) * 1.1,
              )}
              chartRef={widgetChartRef1}
            />
            <MetricWidget
              title="Uso de Memória"
              color="info"
              value={
                <>
                  {metrics['Memory Usage']}&nbsp;
                  <span className="fs-6 fw-normal">(Total: {metrics['Total Memory']})</span>
                </>
              }
              chartData={{
                labels: fillCharts('memory_usage').map((value) => `${value} MB`),
                datasets: [
                  {
                    label: 'Uso de Memória',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: fillCharts('memory_usage'),
                    ...lineStyles.dashed,
                  },
                ],
              }}
              chartOptions={chartOptions(
                Math.min(...fillCharts('memory_usage')) * 0.9,
                Math.max(...fillCharts('memory_usage')) * 1.1,
              )}
              chartRef={widgetChartRef2}
            />
            <MetricWidget
              title="Tempo de Resposta"
              color="warning"
              value={
                <>
                  {metrics['Response Time']}&nbsp;
                  <span className="fs-6 fw-normal">
                    (
                    {(
                      fillCharts('latency')[fillCharts('latency').length - 2] /
                      fillCharts('latency')[fillCharts('latency').length - 1]
                    ).toFixed(2)}
                    )
                  </span>
                </>
              }
              chartData={{
                labels: fillCharts('latency').map((value) => `${value.toFixed(2)}ms`),
                datasets: [
                  {
                    label: 'Latência',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: fillCharts('latency').map((value) => value.toFixed(2)),
                    ...lineStyles.wave,
                  },
                ],
              }}
              chartOptions={chartOptions(
                Math.min(...fillCharts('latency')) * 0.9,
                Math.max(...fillCharts('latency')) * 1.1,
              )}
              chartRef={widgetChartRef3}
            />
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CWidgetStatsB
                className="mb-3"
                color="danger"
                inverse
                progress={{
                  value: diskSpacePercentageFormat,
                }}
                text={`Espaço em disco disponível (total: ${metrics['Total Disk Space']})`}
                title="Espaço em Disco"
                value={`${metrics['Free Disk Space']} (${diskSpacePercentageFormat.toFixed(2)}%)`}
              />
            </CCol>
            <CCol xs={6}>
              <CWidgetStatsB
                className="mb-3"
                color="success"
                inverse
                progress={{
                  value: activeConnectionsPercentageFormat,
                }}
                text={`Conexões atuais simultâneas (total: ${metrics['Max Connections']})`}
                title="Conexões Ativas"
                value={`${metrics['Active Connections']} (${activeConnectionsPercentageFormat.toFixed(2)}%)`}
              />
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

WidgetsDropdown.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  monitorId: PropTypes.number,
}

export default WidgetsDropdown
