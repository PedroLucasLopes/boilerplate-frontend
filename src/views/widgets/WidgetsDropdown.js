// components/WidgetsDropdown.jsx
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { CRow, CFormSelect, CWidgetStatsB, CCol, CFormSwitch, CSpinner } from '@coreui/react'
import NoneCharts from '../NoneCharts/NoneCharts'
import MetricWidget from '../../components/metricWidget'
import { chartOptions, lineStyles } from '../../utils/chartConfig'
import { getStyle } from '@coreui/utils'
import { setId } from '../../hooks/useObservable'
import Blob from '../../components/Blob'
import switchBackground from '../../utils/switchBackground.js'

const calculateAverage = (values) =>
  (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)

const WidgetsDropdown = ({ metrics, loading, monitorId, className, fillCharts }) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const widgetChartRef3 = useRef(null)

  const existentVms = JSON.parse(sessionStorage.getItem('reduxApiState')) || []

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

  const safeReplace = (value, regex, replacement = '') =>
    typeof value === 'string' ? value.replace(regex, replacement) : '0'

  const diskSpacePercentageFormat =
    (Number(safeReplace(metrics['Free Disk Space'], /(G|T|MB|KB|B)/i)) /
      Number(safeReplace(metrics['Total Disk Space'], /(G|T|MB|KB|B)/i))) *
    100

  const formatCpuUsage = fillCharts('cpu_usage')
  const activeConnectionsPercentageFormat =
    (Number(metrics['Active Connections']) / Number(metrics['Max Connections'])) * 100

  const changeStatus = (status) => {
    return status === 'active' ? <Blob label="ON" /> : <Blob label="OFF" style="danger" />
  }

  return (
    <>
      <CRow className={className}>
        <CFormSelect
          value={monitorId || metrics['ID']}
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
      {Object.keys(metrics).length > 0 ? (
        <>
          <CRow className="d-flex align-items-center mb-3">
            <CCol className="d-flex gap-3 align-items-center ms-auto">
              <CFormSwitch
                size="xl"
                label="Alternar"
                id="formSwitchCheckDefaultXL"
                style={{ width: '3rem', marginRight: '.5rem' }}
              />
            </CCol>
            {loading ? (
              <Blob label="Ajustando" style="warning" />
            ) : (
              changeStatus(metrics['PostgreSQL Status'])
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
                labels: fillCharts('cpu_usage').map((value) => `${value}%`),
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
              loading={loading}
              spinnerColor="primary"
            />

            <MetricWidget
              title="Uso de Memória"
              color="info"
              value={
                <>
                  {metrics['Memory Usage']}&nbsp;
                  <span className="fs-6 fw-normal">(Total: {metrics['Total Memory'] || 0})</span>
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
              loading={loading}
              spinnerColor="info"
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
              loading={loading}
              spinnerColor="warning"
            />
          </CRow>
          <CRow>
            <CCol xs={6}>
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    height: '8rem',
                    backgroundColor: switchBackground['danger'],
                    borderRadius: '5px',
                  }}
                >
                  <CSpinner color="danger" variant="grow" />
                </div>
              ) : (
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
              )}
            </CCol>
            <CCol xs={6}>
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    height: '8rem',
                    backgroundColor: switchBackground['success'],
                    borderRadius: '5px',
                  }}
                >
                  <CSpinner color="success" variant="grow" />
                </div>
              ) : (
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
              )}
            </CCol>
          </CRow>
        </>
      ) : (
        <NoneCharts />
      )}
    </>
  )
}

WidgetsDropdown.propTypes = {
  metrics: PropTypes.object,
  className: PropTypes.string,
  monitorId: PropTypes.number,
  loading: PropTypes.bool,
  fillCharts: PropTypes.func,
}

export default WidgetsDropdown
