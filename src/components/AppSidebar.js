import React from 'react'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { useDispatch } from 'react-redux'
import { logout } from '../store/authReducer'
const AppSidebar = () => {
  const dispatch = useDispatch()
  return (
    <CSidebar
      colorScheme="dark"
      position="fixed"
      className="sidebar sidebar-narrow-unfoldable border-end"
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        {/* Botão para fechar a barra lateral */}
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => setToggleSideBar(!toggleSideBar)} // Fecha no clique
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        {/* Botão para alternar expansão */}
        <CSidebarToggler onClick={() => dispatch(logout())} />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
