import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span>Monitor</span>
        <span className="ms-1">&copy; 2024 Original</span>
      </div>
      <div className="ms-auto">
        <span>MonitorVM Live</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
