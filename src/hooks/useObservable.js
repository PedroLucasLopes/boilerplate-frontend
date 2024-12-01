import { BehaviorSubject, timer } from 'rxjs'
import { switchMap, startWith, catchError, filter } from 'rxjs/operators'
import { bind } from '@react-rxjs/core'
import instance from '../api/instance'

// Função para buscar dados do monitor
const fetchData = async (id) => {
  const encodedCredentials = JSON.parse(localStorage.getItem('reduxAuthState')).user
  try {
    const response = await instance.get(`/monitor/${id}`, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    })

    sessionStorage.setItem('monitor', JSON.stringify(response.data))
    return { data: response.data, loading: false, error: null }
  } catch (err) {
    return { data: null, loading: false, error: err.message || 'Erro na requisição' }
  }
}

const idSubject = new BehaviorSubject(
  localStorage.getItem('monitorId') ? JSON.parse(localStorage.getItem('monitorId')) : null,
)

export const setId = (id) => {
  const currentId = JSON.parse(localStorage.getItem('monitorId'))
  if (currentId !== id) {
    localStorage.setItem('monitorId', JSON.stringify(id))
    idSubject.next(id) // Atualiza apenas se o ID mudou
  }
}

const createMonitorObservable = (id$) => {
  return id$.pipe(
    filter((id) => id !== null && id !== undefined), // Ignora IDs inválidos
    switchMap((id) =>
      timer(0, 10000).pipe(
        switchMap(async () => await fetchData(id)), // Requisição para o ID atual
        startWith({ data: null, loading: true, error: null }), // Estado inicial
        catchError((err) => {
          return [{ data: null, loading: false, error: err.message || 'Erro no timer' }]
        }),
      ),
    ),
  )
}

export const [useObservable] = bind(
  () => createMonitorObservable(idSubject),
  { data: null, loading: true, error: null }, // Estado inicial seguro
)
