import { useDispatch } from 'react-redux'
import { login, logout } from '../store/authReducer'
import { setApiData } from '../store/apiReducer'
import { toast } from 'react-toastify'
import instance from '../api/instance'

const useGetVms = () => {
  const dispatch = useDispatch()

  const getVms = async (encodedCredentials) => {
    try {
      const response = await instance.get('/vms', {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      })
      dispatch(setApiData(response.data.vms))
      dispatch(login(encodedCredentials))
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to login'
      toast.error(errorMessage)
      dispatch(logout())
    }
  }

  return { getVms }
}

export default useGetVms
