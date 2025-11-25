<script setup>
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { onBeforeMount, ref } from 'vue'
import { login } from '../api/auth.api.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.store'
import { jwtDecode } from 'jwt-decode'

// Definimos los datos del formulario
const email = ref('')
const password = ref('')
const router = useRouter()
const remindEmail = ref(false)
const userStore = useUserStore()

// Función para manejar el inicio de sesión
const handleLogin = async () => {
  let response = await login({ email: email.value, password: password.value })
  if (response && response.data && response.data.token) {
    const token = response.data.token
    if (remindEmail.value) localStorage.setItem('email', email.value)

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
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <!-- BaseCard centrado -->
    <BaseCard size="md" rounded="lg" shadow="lg" bgColor="bg-white">
      <template #title>
        <h2 class="text-2xl font-bold text-center text-gray-700">Iniciar Sesión</h2>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin">
          <BaseInput
            label="Correo Electrónico"
            placeholder="Ingresa tu correo"
            type="email"
            required
            v-model="email"
            class="mb-4"
          />

          <BaseInput
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
            required
            v-model="password"
            class="mb-4"
          />

          <div class="flex justify-between items-center mb-4">
            <label class="inline-flex items-center">
              <input type="checkbox" class="form-checkbox" v-model="remindEmail" />
              <span class="ml-2 text-gray-600">Recordarme</span>
            </label>
            <br />
            <router-link to="/forgot-password">
              <a href="#" class="text-blue-500 hover:underline text-sm"
                >¿Olvidaste tu contraseña?</a
              >
            </router-link>
          </div>

          <!-- Botón de iniciar sesión -->
          <BaseButton type="submit" color="blue" size="md" class="w-full">
            Iniciar Sesión
          </BaseButton>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-center mt-4">
          <p class="text-sm text-gray-600">
            ¿No tienes una cuenta?
            <router-link to="/signup" class="text-blue-500 hover:underline">
              <a href="#" class="text-blue-500 hover:underline">Regístrate</a>
            </router-link>
          </p>
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped></style>
