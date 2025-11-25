import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  // Estado de la store: aquí se almacenan los datos del usuario
  state: () => ({
    Id: null,
    name: "",
    surname: "",
    email: "",
    camera: "",
    phone: "",
    city: "",
    username: "",
    imageProfile: "",
    iat: null,
    exp: null,
  }),

  // Getters para obtener datos derivados
  getters: {
    fullName(state) {
      return `${state.name} ${state.surname}`;
    },
  },

  // Acciones para actualizar el estado
  actions: {
    setUser(userData) {
      this.Id = userData.Id;
      this.name = userData.name;
      this.surname = userData.surname;
      this.email = userData.email;
      this.camera = userData.camera;
      this.phone = userData.phone;
      this.city = userData.city;
      this.username = userData.username;
      this.iat = userData.iat;
      this.exp = userData.exp;
      this.imageProfile = userData.imageProfile;
    },
    // Función para limpiar los datos de la store
    clearUser() {
      this.Id = null;
      this.name = "";
      this.surname = "";
      this.email = "";
      this.camera = "";
      this.phone = "";
      this.city = "";
      this.username = "";
      this.imageProfile = "";
      this.iat = null;
      this.exp = null;
    },
    setImageProfile(imageProfile) {
      this.imageProfile = imageProfile;
    },
  },
});
