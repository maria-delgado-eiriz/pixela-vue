import { defineStore } from 'pinia'
import { getUserFollowers, getUserFollowing } from '@/api/users.api.js'

export const useUserStore = defineStore('user', {
  // Estado de la store: aquí se almacenan los datos del usuario
  state: () => ({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    image: '',
    followers: [],
    following: [],
    iat: null,
    exp: null,
  }),

  // Getters para obtener datos derivados
  getters: {
    fullName(state) {
      return `${state.firstName} ${state.lastName}`
    },
  },

  // Acciones para actualizar el estado
  actions: {
    setUser(userData) {
      this.id = userData.id
      this.firstName = userData.firstName
      this.lastName = userData.lastName
      this.email = userData.email
      this.username = userData.username
      this.iat = userData.iat
      this.exp = userData.exp
    },
    async loadFollowers(userId) {
      const followersData = await getUserFollowers(userId)
      this.followers = followersData && followersData.length ? followersData : []
    },

    async loadFollowing(userId) {
      const followingData = await getUserFollowing(userId)
      this.following = followingData && followingData.length ? followingData : []
    },

    setUserImage(image) {
      this.image = image
    },
    // Función para limpiar los datos de la store
    clearUser() {
      this.id = null
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.username = ''
      this.image = ''
      this.followers = []
      this.following = []
      this.iat = null
      this.exp = null
    },
    setImageProfile(image) {
      this.image = image
    },
  },
})
