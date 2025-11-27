import httpClient from './httpClient'

const END_POINT = '/posts'

export const createPost = async data => httpClient.post(`${END_POINT}`, data)
export const fetchPosts = async () => {
  const response = await httpClient.get(`${END_POINT}`)
  return response.data
}

export const likePost = async postId => {
  const response = await httpClient.post(`${END_POINT}/${postId}/like`)
  return response.data
}

export const unlikePost = async postId => {
  const response = await httpClient.post(`${END_POINT}/${postId}/unlike`)
  return response.data
}
