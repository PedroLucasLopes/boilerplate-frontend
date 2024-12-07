import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import instance from '../api/instance'
import token from '../utils/token'

const useGetListBackup = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const getBackups = async () => {
    try {
      setLoading(true)

      const response = await instance.get('/list_backups', {
        headers: {
          Authorization: `Basic ${token && token}`,
        },
      })
      sessionStorage.setItem('scheduled_backups', JSON.stringify(response.data))
      setData(response.data)
    } catch (e) {
      const errorMessage = e.response?.data?.detail || 'Failed to list backups'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBackups()
  }, [])

  return { data, loading, error, getBackups }
}

export default useGetListBackup
