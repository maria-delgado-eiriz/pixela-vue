import httpClient from './httpClient'

const BASE_PATH = '/auth'

export const login = async data => {
  return httpClient.post(`${BASE_PATH}/login`, data)
}
