import React, { useCallback, useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CButton,
  CButtonGroup,
  CRow,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import PropTypes from 'prop-types'
import instance from '../../../api/instance'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import WarningContainer from '../../WarningContainer/WarningContainer'

const ScheduleModal = ({ scheduleVisible, setScheduleVisible, metrics }) => {
  const [schedule, setSchedule] = useState({})
  const [allScheduledBackups, setAllScheduledBackups] = useState()
  const encodedCredentials = JSON.parse(localStorage.getItem('reduxAuthState')).user
  const handleBackup = useCallback(async () => {
    try {
      console.log({ ...schedule, ip: metrics['IP'], database: 'postgre' })
      const response = await instance.post(
        '/schedule_backup',
        { ...schedule, ip: metrics['IP'], database: 'postgre' },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      )
      toast.success(response.data.message)
      setScheduleVisible(false)
    } catch (e) {
      const errorMessage = e.response?.data?.detail || 'Failed to backup'
      toast.error(errorMessage)
    }
  }, [schedule])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/list_backups', {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        })
        setAllScheduledBackups(response.data)
      } catch (e) {
        const errorMessage = e.response?.data?.detail || 'Failed to list backups'
        toast.error(errorMessage)
      }
    }
    fetchData()
  }, [])

  const toggleActive = (frequency) => {
    return schedule && schedule.frequency === frequency ? true : false
  }

  const handleNumber = (e) => {
    const value = e.target.value

    // Permite que o campo esteja vazio para digitação
    if (value === '') return

    // Força o valor a estar dentro do intervalo 1-31 após digitação
    const numericValue = Math.max(1, Math.min(31, Number(value))) // Garante que o valor esteja entre 1 e 31
    e.target.value = numericValue
  }

  const timeIntervalToSchedule = (value, parameter, timeStart = 0, timeLimit) => {
    // Garante que esteja entre 0 e 23
    if (value >= timeStart && value <= timeLimit) {
      setSchedule((prev) => ({ ...prev, [parameter]: value }))
    } else if (value > timeLimit) {
      setSchedule((prev) => ({ ...prev, [parameter]: timeLimit })) // Ajusta para o máximo permitido
    } else if (value < 0 || isNaN(value)) {
      setSchedule((prev) => ({ ...prev, [parameter]: '' })) // Reseta se inválido
    }
  }

  const handleTime = (e, parameter, timeLimit) => {
    // Permite somente números
    if (!/^\d*$/.test(e)) return

    // Converte o valor para número
    let value = parseInt(e, 10)

    timeIntervalToSchedule(value, parameter, 0, timeLimit)
  }

  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  const dayOfWeek = [
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
    'domingo',
  ]
  const selectedDay = {
    'segunda-feira': 'mon',
    'terça-feira': 'tue',
    'quarta-feira': 'wed',
    'quinta-feira': 'thu',
    'sexta-feira': 'fri',
    sábado: 'sat',
    domingo: 'sun',
  }

  return (
    <>
      <CModal
        visible={scheduleVisible}
        onClose={() => setScheduleVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">
            Agendar Backup de {metrics['Name']} ({metrics['IP']})
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Qual a frequência que deseja agendar o backup?</p>
          <div className="d-flex align-items-center justify-content-between">
            <CButtonGroup className="mb-3">
              <CButton
                color="primary"
                value="once"
                onClick={(e) => setSchedule((prev) => ({ ...prev, frequency: e.target.value }))}
                active={toggleActive('once')}
              >
                Único
              </CButton>
              <CButton
                color="primary"
                value="daily"
                onClick={(e) => setSchedule((prev) => ({ ...prev, frequency: e.target.value }))}
                active={toggleActive('daily')}
              >
                Diariamente
              </CButton>
              <CButton
                color="primary"
                value="weekly"
                onClick={(e) => setSchedule((prev) => ({ ...prev, frequency: e.target.value }))}
                active={toggleActive('weekly')}
              >
                Semanalmente
              </CButton>
              <CButton
                color="primary"
                value="monthly"
                onClick={(e) => setSchedule((prev) => ({ ...prev, frequency: e.target.value }))}
                active={toggleActive('monthly')}
              >
                Mensalmente
              </CButton>
            </CButtonGroup>
            {schedule && (
              <div className="d-flex align-items-center mb-3 gap-2">
                <span>Horário do Backup</span>
                <CFormInput
                  placeholder={hours}
                  style={{ width: '3rem' }}
                  value={schedule.hour || ''}
                  onChange={(e) => handleTime(e.target.value, 'hour', 23)}
                />
                <span>:</span>
                <CFormInput
                  placeholder={minutes}
                  style={{ width: '3rem' }}
                  value={schedule.minute || ''}
                  onChange={(e) => handleTime(e.target.value, 'minute', 59)}
                />
              </div>
            )}
          </div>

          {schedule && schedule.frequency === 'weekly' && (
            <CFormSelect
              onChange={(e) => setSchedule((prev) => ({ ...prev, day_of_week: e.target.value }))}
              className="mb-3"
            >
              {dayOfWeek.map((day) => {
                return (
                  <option value={selectedDay[day]} key={day}>
                    {day}
                  </option>
                )
              })}
            </CFormSelect>
          )}
          {schedule && schedule.frequency === 'monthly' && (
            <CFormInput
              placeholder="Qual dia do mês? (Intervalo do dia 1 ao 31)"
              type="number"
              min="1"
              max="31"
              className="mb-3"
              onChange={(e) =>
                setSchedule((prev) => ({
                  ...prev,
                  day_of_month: Number(e.target.value),
                }))
              }
              onInput={handleNumber}
            />
          )}
          {allScheduledBackups && allScheduledBackups.length > 0 ? (
            <>
              <CRow>
                <h5>Agendamentos Realizados</h5>
              </CRow>
              <div className="border-top mb-3"></div>
            </>
          ) : (
            <WarningContainer
              title="Quando agendar um backup ele aparecerá abaixo"
              color="transparent"
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setScheduleVisible(false)}>
            Fechar
          </CButton>
          <CButton color="info" onClick={handleBackup}>
            Realizar Agendamento
          </CButton>
        </CModalFooter>
      </CModal>
      <ToastContainer />
    </>
  )
}

ScheduleModal.propTypes = {
  scheduleVisible: PropTypes.bool.isRequired,
  setScheduleVisible: PropTypes.func.isRequired,
  metrics: PropTypes.object,
}

export default ScheduleModal
