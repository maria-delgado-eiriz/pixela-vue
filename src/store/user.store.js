import { defineStore } from 'pinia'

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
    setFollowers(followers) {
      this.followers = followers && followers.length ? followers : []
    },
    setFollowing(following) {
      this.following = following && following.length ? following : []
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
