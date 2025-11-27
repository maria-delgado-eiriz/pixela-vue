<script setup lang="js">
import { RouterView, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHome,
  faUser,
  faSignOutAlt,
  faComments,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import { ref, onBeforeMount } from 'vue'
import { useUserStore } from '../store/user.store'
import { jwtDecode } from 'jwt-decode'
import { useRoute } from 'vue-router'
import { getUserFollowers, getUserFollowing } from '@/api/users.api.js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const mobileMenuOpen = ref(false)

const logout = () => {
  localStorage.removeItem('token')
  router.push({ name: 'login' })
}

const goToProfile = () => {
  router.push({ name: 'profile', params: { id: userStore.id } })
  if (route.name === 'profile') setTimeout(() => router.go(0), 100)
}

onBeforeMount(async () => {
  if (!localStorage.getItem('token')) {
    router.push({ name: 'login' })
  } else {
    let token = localStorage.getItem('token')
    const isExpired = Date.now() >= jwtDecode(token).exp * 1000

    if (isExpired) {
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    } else {
      const tokenDecoded = jwtDecode(token)
      userStore.setUser(tokenDecoded)
      const userId = tokenDecoded.id

      const followersData = await getUserFollowers(userId)
      const followingData = await getUserFollowing(userId)

      userStore.setFollowers(followersData)
      userStore.setFollowing(followingData)
    }
  }
})
</script>

<template>
  <div
    class="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex flex-col"
  >
    <!-- NAVBAR -->
    <header
      class="w-full fixed top-0 left-0 z-30 backdrop-blur-md bg-gray-900/80 border-b border-indigo-500/30 shadow-xl transition-all duration-300"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <!-- LOGO -->
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center"
          >
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <h1 class="text-xl md:text-2xl font-bold text-white drop-shadow-lg">SnapConnect</h1>
        </div>

        <!-- DESKTOP MENU -->
        <nav class="hidden md:flex items-center space-x-2">
          <router-link to="/" class="nav-btn">
            <FontAwesomeIcon :icon="faHome" />
            <span>Home</span>
          </router-link>

          <router-link to="/search" class="nav-btn">
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
            <span>Buscar</span>
          </router-link>

          <router-link to="/chats" class="nav-btn">
            <FontAwesomeIcon :icon="faComments" />
            <span>Chat</span>
          </router-link>

          <div class="w-px h-8 bg-gray-600 mx-2"></div>

          <a @click="goToProfile()" class="nav-btn-icon cursor-pointer" title="Profile">
            <FontAwesomeIcon :icon="faUser" />
          </a>

          <a @click="logout()" class="nav-btn-icon" title="Logout">
            <FontAwesomeIcon :icon="faSignOutAlt" />
          </a>
        </nav>

        <!-- MOBILE MENU BUTTON -->
        <button
          class="md:hidden text-white hover:text-indigo-300 transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <FontAwesomeIcon :icon="mobileMenuOpen ? faXmark : faBars" class="w-7 h-7" />
        </button>
      </div>

      <!-- MOBILE MENU -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-indigo-500/30 flex flex-col space-y-2 px-6 py-4"
      >
        <router-link @click="mobileMenuOpen = false" to="/" class="mobile-btn">
          <FontAwesomeIcon :icon="faHome" /> Home
        </router-link>

        <a @click="goToProfile(), (mobileMenuOpen = false)" class="mobile-btn">
          <FontAwesomeIcon :icon="faUser" /> Profile
        </a>

        <router-link @click="mobileMenuOpen = false" to="/search" class="mobile-btn">
          <FontAwesomeIcon :icon="faMagnifyingGlass" /> Buscar
        </router-link>

        <router-link @click="mobileMenuOpen = false" to="/chats" class="mobile-btn">
          <FontAwesomeIcon :icon="faComments" /> Chat
        </router-link>

        <div class="h-px bg-gray-700 my-2"></div>

        <a @click="logout(), (mobileMenuOpen = false)" class="mobile-btn">
          <FontAwesomeIcon :icon="faSignOutAlt" /> Logout
        </a>
      </div>
    </header>

    <!-- CONTENT -->
    <main class="pt-[90px] flex-1 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.nav-btn {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300
         transition-all duration-200 hover:bg-indigo-600/20 hover:text-white cursor-pointer;
}

.nav-btn-icon {
  @apply flex items-center justify-center w-10 h-10 rounded-lg text-gray-300
         transition-all duration-200 hover:bg-gray-700/50 hover:text-white cursor-pointer;
}

.mobile-btn {
  @apply flex items-center space-x-3 text-gray-300 py-2 px-3 text-base rounded-lg
         hover:bg-indigo-600/20 hover:text-white transition-all duration-200;
}
</style>
