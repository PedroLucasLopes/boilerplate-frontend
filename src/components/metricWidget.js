// components/MetricWidget.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { CCol, CWidgetStatsA } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'

const MetricWidget = ({ title, value, color, chartData, chartOptions, chartRef }) => (
  <CCol sm={6} xl={4} xxl={4}>
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
  </CCol>
)

MetricWidget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  chartData: PropTypes.object.isRequired,
  chartOptions: PropTypes.object.isRequired,
  chartRef: PropTypes.object,
}

export default MetricWidget
