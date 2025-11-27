import httpClient from './httpClient'

const BASE_PATH = '/users'

export const getUserProfile = async userId => {
  const response = await httpClient.get(`${BASE_PATH}/${userId}/profile`)
  return response.data
}
