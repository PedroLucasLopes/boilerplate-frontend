import { useObservable, setId } from './useObservable'

const useMonitor = (id) => {
  if (id) {
    setId(id)
  }

  const result = useObservable() || { data: null, loading: true, error: null }

  const { data, loading, error } = result

  return { data, loading, error }
}

export default useMonitor
