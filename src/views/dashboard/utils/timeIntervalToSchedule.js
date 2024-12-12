const timeIntervalToSchedule = (value, parameter, timeStart = 0, timeLimit, setSchedule) => {
  // Garante que esteja entre 0 e 23
  if (value >= timeStart && value <= timeLimit) {
    setSchedule((prev) => ({ ...prev, [parameter]: parseInt(value) }))
  } else if (value > timeLimit) {
    setSchedule((prev) => ({ ...prev, [parameter]: parseInt(timeLimit) })) // Ajusta para o máximo permitido
  } else if (value < 0 || isNaN(value)) {
    setSchedule((prev) => ({ ...prev, [parameter]: 0 })) // Reseta se inválido
  }
}

export default timeIntervalToSchedule
