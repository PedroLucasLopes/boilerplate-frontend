const useIpMask = () => {
  const ipMask = (value) => {
    // Remove tudo o que não for número
    value = value.replace(/\D/g, '')

    // Aplica a máscara para o formato xxx.xxx.x.x
    if (value.length <= 3) {
      return value // Apenas o primeiro bloco
    }
    if (value.length <= 6) {
      return `${value.slice(0, 3)}.${value.slice(3)}` // Primeiro e segundo bloco
    }
    if (value.length <= 7) {
      return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}` // Primeiro, segundo e terceiro bloco
    }
    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 7)}.${value.slice(7, 8)}` // Todos os blocos
  }

  return { ipMask }
}

export default useIpMask
