import React, { useCallback, useState } from 'react'
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
  CTable,
} from '@coreui/react'
import PropTypes from 'prop-types'
import instance from '../../../api/instance'
import { toast, ToastContainer } from 'react-toastify'
import WarningContainer from '../../WarningContainer/WarningContainer'
import token from '../../../utils/token'
import { columns } from '../utils/TableSchedule'
import useGetListBackup from '../../../hooks/useGetListBackup'
import formatBackupSchedule from '../../../utils/formatBackupSchedule'
import formatTime from '../utils/formatTime'
import { dayOfWeek, selectedDay, hours, minutes } from '../constants/days'

const ScheduleModal = ({ scheduleVisible, setScheduleVisible, metrics }) => {
  const [schedule, setSchedule] = useState({})

  const { data: allScheduledBackups, getBackups } = useGetListBackup()

  const handleBackup = useCallback(async () => {
    try {
      const response = await instance.post(
        '/schedule_backup',
        { ...schedule, ip: metrics['IP'] },
        {
          headers: {
            Authorization: `Basic ${token()}`,
          },
        },
      )
      toast.success(response.data.message)
      setScheduleVisible(false)
      getBackups()
    } catch (e) {
      const errorMessage = e.response?.data?.detail || 'Failed to backup'
      toast.error(errorMessage)
    }
  }, [schedule])

  const toggleActive = (frequency) => {
    return schedule && schedule.frequency === frequency ? true : false
  }

  const items =
    allScheduledBackups &&
    allScheduledBackups.scheduled_backups.map((schedule) => {
      return {
        job_id: formatBackupSchedule(schedule.job_id),
        database_name: schedule.database_name,
        vm_ip: schedule.vm_ip,
        status: schedule.status,
      }
    })

  return (
    <>
      <CModal
        visible={scheduleVisible}
        onClose={() => {
          setScheduleVisible(false)
          setSchedule({})
        }}
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
            {schedule.frequency && (
              <div className="flex-col align-items-center justify-center mb-3 gap-2">
                <div className="w-auto d-flex gap-2 mb-3 justify-center align-items-center">
                  <span>Horário do Backup</span>
                  <CFormInput
                    placeholder={hours}
                    style={{ width: '3rem' }}
                    defaultValue={schedule.hour || ''}
                    onChange={(e) => formatTime(Number(e.target.value), 'hour', 23, setSchedule)}
                  />
                  <span>:</span>
                  <CFormInput
                    placeholder={minutes}
                    style={{ width: '3rem' }}
                    value={schedule.minute || ''}
                    onChange={(e) => formatTime(Number(e.target.value), 'minute', 59, setSchedule)}
                  />
                </div>
                {metrics['databases'] && (
                  <CFormSelect
                    value={schedule.database}
                    onChange={(e) =>
                      setSchedule((prev) => ({ ...prev, database: Number(e.target.value) }))
                    }
                    aria-label="VM Select Input"
                  >
                    <option defaultValue>postgres</option>
                    {metrics['databases'].map((database, i) => (
                      <option value={database} key={i}>
                        {database}
                      </option>
                    ))}
                  </CFormSelect>
                )}
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
              onInput={formatTime}
            />
          )}
          {allScheduledBackups && allScheduledBackups.scheduled_backups.length > 0 ? (
            <>
              <CRow>
                <h5>Agendamentos Realizados</h5>
              </CRow>
              <div className="border-top mb-3"></div>
              <CTable columns={columns} items={items} className="text-center" />
            </>
          ) : (
            <WarningContainer
              title="Quando agendar um backup ele aparecerá abaixo"
              color="transparent"
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setScheduleVisible(false)
              setSchedule({})
            }}
          >
            Fechar
          </CButton>
          <CButton
            color="info"
            onClick={handleBackup}
            disabled={!schedule.frequency ? true : false}
          >
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
