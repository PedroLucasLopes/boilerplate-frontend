import React from 'react'
import PropTypes from 'prop-types'
import { CCol, CWidgetStatsA, CSpinner } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import switchBackground from '../utils/switchBackground'

const MetricWidget = ({
  title,
  value,
  color,
  chartData,
  chartOptions,
  chartRef,
  loading,
  spinnerColor = 'light',
}) => (
  <CCol sm={6} xl={4} xxl={4}>
    {loading ? (
      // Exibe o spinner centralizado quando "loading" for true
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: '10rem',
          backgroundColor: switchBackground[spinnerColor],
          borderRadius: '5px',
        }}
      >
        <CSpinner color={spinnerColor} variant="grow" />
      </div>
    ) : (
      // Renderiza o widget normalmente quando "loading" for false
      <CWidgetStatsA
        color={color}
        value={value}
        title={title}
        chart={
          <CChartLine
            ref={chartRef}
            className="mt-3 mx-3"
            style={{ height: '70px' }}
            data={chartData}
            options={chartOptions}
          />
        }
      />
    )}
  </CCol>
)

MetricWidget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  chartData: PropTypes.object.isRequired,
  chartOptions: PropTypes.object.isRequired,
  chartRef: PropTypes.object,
  loading: PropTypes.bool, // Adicionado
  spinnerColor: PropTypes.string, // Adicionado
}

export default MetricWidget
