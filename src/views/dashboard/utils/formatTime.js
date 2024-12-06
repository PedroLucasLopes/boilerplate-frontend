import timeIntervalToSchedule from './timeIntervalToSchedule'

const formatTime = (e, parameter, timeLimit) => {
  // Permite somente números
  if (!/^\d*$/.test(e)) return

  // Converte o valor para número
  let value = parseInt(e, 10)

  timeIntervalToSchedule(value, parameter, 0, timeLimit)
}

export default formatTime
