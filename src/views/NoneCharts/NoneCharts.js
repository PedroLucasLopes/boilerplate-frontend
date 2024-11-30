import React from 'react'
import { CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CContainer } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'

const NoneCharts = () => {
  return (
    <CContainer className="d-flex justify-content-center align-items-center">
      <CCard className="text-center shadow-sm border-0" color="primary" textColor="light">
        <CCardHeader>
          <CIcon icon={cilWarning} size="lg" className="text-warning me-2" />
          Nenhum Monitoramento
        </CCardHeader>
        <CCardBody>
          <CCardTitle>Sem Dados Disponíveis</CCardTitle>
          <CCardText>
            Nenhum monitoramento foi selecionado. Por favor, escolha uma máquina virtual (VM) para
            que os gráficos possam ser gerados.
          </CCardText>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default NoneCharts
