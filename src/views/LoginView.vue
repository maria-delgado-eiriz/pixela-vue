<script setup>
import { onBeforeMount, ref } from 'vue'
import { login } from '../api/auth.api.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.store'
import { jwtDecode } from 'jwt-decode'

// Definimos los datos del formulario
const email = ref('')
const password = ref('')
const router = useRouter()
const remember = ref(false)
const userStore = useUserStore()

// Función para manejar el inicio de sesión
const submitLogin = async () => {
  let response = await login({ email: email.value, password: password.value })
  if (response && response.data && response.data.token) {
    const token = response.data.token
    if (remember.value) localStorage.setItem('email', email.value)

    const tokenDecoded = jwtDecode(token)
    userStore.setUser(tokenDecoded)
    localStorage.setItem('token', token)
    router.push({ name: 'home' })
  }
}

onBeforeMount(() => {
  if (localStorage.getItem('token')) router.push({ name: 'home' })
  else if (localStorage.getItem('email')) email.value = localStorage.getItem('email')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>

      <form @submit.prevent="submitLogin">
        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-1"> Email </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="email"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-medium mb-1"> Contraseña </label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="********"
            required
          />
        </div>

        <!-- Remember + Forgot -->
        <div class="flex items-center justify-between mb-6">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="remember"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-gray-600 text-sm">Recordarme</span>
          </label>

          <router-link to="/forgot-password" class="text-blue-500 text-sm hover:underline">
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>

      <!-- Register Link -->
      <p class="text-center mt-6 text-sm text-gray-600">
        ¿No tienes cuenta?
        <router-link to="/signup" class="text-blue-600 hover:underline"> Regístrate </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
