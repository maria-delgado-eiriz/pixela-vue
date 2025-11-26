import httpClient from './httpClient'

const END_POINT = '/posts'

export const createPost = async data => httpClient.post(`${END_POINT}`, data)
export const fetchPosts = async () => {
  const response = await httpClient.get(`${END_POINT}`)
  return response.data
}
