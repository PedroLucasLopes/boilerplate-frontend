import instance from '../api/instance'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/authReducer'
import { setApiData } from '../store/apiReducer'
import { setPagination } from '../store/paginationReducer'
import { toast } from 'react-toastify'
import { useState } from 'react'

const useGetVms = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const pagination = useSelector((state) => state.pag)

  const getVms = async (token, page = 1) => {
    try {
      setLoading(true)
      const response = await instance.get(`/vms?page=${page}`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
      const paginationState = {
        total_items: response.data.total_items,
        page: response.data.page,
        page_size: response.data.page_size,
        total_pages: response.data.total_pages,
      }
      token && dispatch(login(token))
      dispatch(setApiData(response.data.vms))
      dispatch(setPagination(paginationState))
      setLoading(false)
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.detail || 'Failed to fetch VMs'
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  return {
    getVms,
    pagination,
    loading,
  }
}

export default useGetVms
