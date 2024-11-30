import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilExitToApp } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authReducer'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="align-items-center" caret={false}>
        <CIcon icon={cilExitToApp} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={() => dispatch(logout())}>
          <CIcon icon={cilExitToApp} className="me-2" />
          Sair
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
