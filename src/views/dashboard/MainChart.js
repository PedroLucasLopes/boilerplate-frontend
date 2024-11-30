import React, { useEffect, useRef } from 'react'

import PropTypes from 'prop-types'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ fillCharts }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  const formatDateArr = fillCharts('timestamps').map((timestamp) => {
    const date = new Date(timestamp) // Converter o timestamp para um objeto Date
    const hours = String(date.getHours()).padStart(2, '0') // Formatar horas com zero à esquerda
    const minutes = String(date.getMinutes()).padStart(2, '0') // Formatar minutos com zero à esquerda
    return `${hours}:${minutes}` // Retornar no formato hh:mm
  })

  const formatNumber = (num) => {
    const units = ['', 'K', 'M', 'B', 'T'] // Definir os sufixos
    const magnitude = Math.floor(Math.log10(num) / 3) // Calcular a magnitude
    const scaled = num / Math.pow(10, magnitude * 3) // Reduzir o número

    // Garantir que magnitude está dentro do range de unidades
    return magnitude > 0 && magnitude < units.length
      ? `${scaled.toFixed(2)}${units[magnitude]}`
      : num.toString() // Retorna o número original se for menor que 1 mil
  }

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels: formatDateArr,
          datasets: [
            {
              label: 'Leituras do Banco',
              backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
              borderColor: getStyle('--cui-info'),
              pointHoverBackgroundColor: getStyle('--cui-info'),
              borderWidth: 2,
              data: fillCharts('db_reads'), // Use os valores brutos aqui
              fill: true,
            },
            {
              label: 'Escritas no Banco',
              backgroundColor: 'transparent',
              borderColor: getStyle('--cui-success'),
              pointHoverBackgroundColor: getStyle('--cui-success'),
              borderWidth: 2,
              data: fillCharts('db_writes'), // Use os valores brutos aqui
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.raw // Pega o valor numérico bruto
                  return `${context.dataset.label}: ${formatNumber(value)}` // Formata o valor
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'),
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              min: Math.min(...fillCharts('db_writes'), ...fillCharts('db_reads')) * 0.9,
              max: Math.max(...fillCharts('db_writes'), ...fillCharts('db_reads')) * 1.1,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                callback: function (value) {
                  return formatNumber(value) // Formata os valores das escalas
                },
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
            },
          },
        }}
      />
    </>
  )
}

MainChart.propTypes = {
  fillCharts: PropTypes.func,
}

export default MainChart
