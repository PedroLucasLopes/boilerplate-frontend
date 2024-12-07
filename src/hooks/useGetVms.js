import { useDispatch, useSelector } from 'react-redux'
import { setApiData } from '../store/apiReducer'
import { setPagination } from '../store/paginationReducer'
import { toast } from 'react-toastify'
import instance from '../api/instance'

const useGetVms = () => {
  const dispatch = useDispatch()

  const pagination = useSelector((state) => state.pagination)

  const getVms = async (token, page = 1) => {
    try {
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
      dispatch(setApiData(response.data.vms))
      dispatch(setPagination(paginationState))
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch VMs'
      toast.error(errorMessage)
    }
  }

  return {
    getVms,
    pagination,
  }
}

export default useGetVms
