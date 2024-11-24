import React, { useCallback, useState } from 'react'
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
import { useDispatch } from 'react-redux'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import Register from '../register/Register'
import instance from '../../../api/instance'
import { login, logout } from '../../../store/store'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const dispatch = useDispatch()
  const [user, setUser] = useState({ name: '', pass: '' })
  const [register, setRegister] = useState(false)
  const encodedCredentials = btoa(`${user.name}:${user.pass}`)

  const notify = () => error && toast(error)

  const loginUser = useCallback(async () => {
    try {
      const response = await instance.get('/vms', {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      })
      dispatch(login({ name: user.name, pass: user.pass }))
    } catch (error) {
      const errorMessage = error.response?.data?.detail
      toast.error(errorMessage)
      dispatch(logout())
    }
  }, [user, encodedCredentials, dispatch])

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
                        <CButton color="primary" className="px-4" onClick={loginUser}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <CButton
                      color="primary"
                      className="mt-3"
                      active
                      tabIndex={-1}
                      onClick={() => setRegister(true)}
                    >
                      Register Now!
                    </CButton>
                  </div>
                </CCardBody>
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
