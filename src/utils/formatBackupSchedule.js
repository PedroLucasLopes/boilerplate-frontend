export default function formatBackupSchedule(schedule) {
  // Mapear os tipos de frequência
  const frequencyMap = {
    weekly: 'semanal',
    daily: 'diário',
    once: 'uma vez',
    monthly: 'mensal',
  }

  // Separar os elementos da string
  const parts = schedule.split('_')

  // Identificar a frequência e o índice dela
  const frequencyKey = parts.find((part) => frequencyMap[part])
  const frequencyIndex = parts.indexOf(frequencyKey)

  // Se não encontrar a frequência, retorne como inválida
  if (frequencyIndex === -1) {
    return 'Frequência desconhecida'
  }

  // Pegar hora e minuto a partir do índice da frequência
  const hour = parts[frequencyIndex + 1] || '00'
  const minute = parts[frequencyIndex + 2] || '00'

  // Garantir que hora e minuto tenham dois dígitos
  const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
  const frequency = frequencyMap[frequencyKey]

  // Formatar a string final
  return `${frequency} - ${formattedTime}`
}
