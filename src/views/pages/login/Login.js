import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import Register from '../register/Register'
import { ToastContainer } from 'react-toastify'
import useGetVms from '../../../hooks/useGetVms'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const [user, setUser] = useState({ name: '', pass: '' })
  const [register, setRegister] = useState(false)

  const { getVms } = useGetVms()

  const handleLogin = () => {
    const encodedCredentials = btoa(`${user.name}:${user.pass}`)
    getVms(encodedCredentials)
  }

  return !register ? (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        onBlur={(e) =>
                          setUser((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onBlur={(e) =>
                          setUser((prev) => ({
                            ...prev,
                            pass: e.target.value,
                          }))
                        }
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleLogin}>
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center"></CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  ) : (
    <Register setRegister={setRegister} />
  )
}

export default Login
