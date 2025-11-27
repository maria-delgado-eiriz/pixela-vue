<script setup>
import { ref, onBeforeMount } from 'vue'
import { useUserStore } from '../store/user.store'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEdit, faHeart, faUserPlus, faUsers, faImage } from '@fortawesome/free-solid-svg-icons'
import PostGrid from '../components/PostGrid.vue'
import UserList from '../components/UserList.vue'
import EmptyState from '../components/EmptyState.vue'
import { getUserProfile } from '../api/users.api'

const userStore = useUserStore()

const activeTab = ref('details')
const profileData = ref(null)
const loading = ref(true)

const likedPosts = ref([])
const posts = ref([])

const tabs = [
  { id: 'details', label: 'Perfil', icon: faEdit },
  { id: 'posts', label: 'Publicaciones', icon: faImage },
  { id: 'likes', label: 'Me gusta', icon: faHeart },
  { id: 'following', label: 'Seguidos', icon: faUserPlus },
  { id: 'followers', label: 'Seguidores', icon: faUsers },
]

const getUserInitial = () => {
  const fullName = getFullName()
  return fullName?.charAt(0)?.toUpperCase() || userStore.firstName?.charAt(0)?.toUpperCase() || 'U'
}

const getFullName = () => {
  return (
    (profileData.value?.firstName && profileData.value?.lastName
      ? `${profileData.value.firstName} ${profileData.value.lastName}`
      : userStore.fullName || userStore.firstName) || 'Usuario'
  )
}

onBeforeMount(async () => {
  try {
    loading.value = true
    const profile = await getUserProfile(userStore.id)
    profileData.value = profile

    if (profile.likedPosts) likedPosts.value = profile.likedPosts
    if (profile.posts) posts.value = profile.posts
  } catch (error) {
    console.error('Error al cargar perfil:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header con imagen de perfil -->
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl mb-8"
      >
        <!-- Banner -->
        <div class="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
          <div class="absolute inset-0 bg-black/20"></div>
        </div>

        <!-- Información del perfil -->
        <div class="relative px-8 pb-8">
          <!-- Imagen de perfil -->
          <div class="flex justify-between items-start -mt-20 mb-4">
            <div class="relative">
              <div
                v-if="profileData?.imageProfile || userStore.imageProfile"
                class="w-32 h-32 rounded-full border-4 border-gray-800 overflow-hidden shadow-xl"
              >
                <img
                  :src="profileData?.imageProfile || userStore.imageProfile"
                  :alt="profileData?.firstName || userStore.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-32 h-32 rounded-full border-4 border-gray-800 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl"
              >
                <span class="text-white font-bold text-4xl">{{ getUserInitial() }}</span>
              </div>
            </div>

            <!-- Botón editar perfil -->
            <button
              v-if="activeTab === 'details'"
              class="mt-20 text-gray-300 px-4 py-2 rounded-lg hover:bg-indigo-600/20 hover:text-white transition-all flex items-center space-x-2 border border-gray-700 hover:border-indigo-500/30"
            >
              <FontAwesomeIcon :icon="faEdit" />
              <span>Editar perfil</span>
            </button>
          </div>

          <!-- Nombre y username -->
          <div class="mb-4">
            <h1 class="text-3xl font-bold text-white mb-1">
              {{ getFullName() }}
            </h1>
            <p class="text-gray-400">@{{ profileData?.username || userStore.username }}</p>
          </div>

          <!-- Estadísticas -->
          <div class="flex space-x-6 text-sm">
            <div>
              <span class="text-white font-semibold">{{ posts.length }}</span>
              <span class="text-gray-400 ml-1">Posts</span>
            </div>
            <div>
              <span class="text-white font-semibold">{{ userStore.followers.length }}</span>
              <span class="text-gray-400 ml-1">Seguidores</span>
            </div>
            <div>
              <span class="text-white font-semibold">{{ userStore.following.length }}</span>
              <span class="text-gray-400 ml-1">Seguidos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs de navegación -->
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-2 mb-8 shadow-lg"
      >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 min-w-[140px] flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200',
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50',
            ]"
          >
            <FontAwesomeIcon :icon="tab.icon" />
            <span class="hidden sm:inline">{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <!-- Contenido de los tabs -->
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-8 shadow-lg"
      >
        <!-- Detalles del perfil -->
        <div v-if="activeTab === 'details'" class="space-y-6">
          <h2 class="text-2xl font-bold text-white mb-6">Información del perfil</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Nombre</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.firstName || userStore.name || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Apellidos</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.lastName || userStore.surname || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Email</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.email || userStore.email || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Username</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                @{{ profileData?.username || userStore.username || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Teléfono</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.phone || userStore.phone || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Ciudad</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.city || userStore.city || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Cámara</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.camera || userStore.camera || 'No especificado' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Publicaciones -->
        <div v-else-if="activeTab === 'posts'">
          <h2 class="text-2xl font-bold text-white mb-6">Mis Publicaciones</h2>

          <EmptyState
            v-if="posts.length === 0"
            :icon="faImage"
            message="Aún no tienes ninguna publicación"
          />

          <PostGrid v-else :posts="posts" />
        </div>

        <!-- Me gusta -->
        <div v-else-if="activeTab === 'likes'">
          <h2 class="text-2xl font-bold text-white mb-6">Posts que me gustan</h2>

          <EmptyState
            v-if="likedPosts.length === 0"
            :icon="faHeart"
            message="Aún no has dado like a ninguna publicación"
          />

          <PostGrid v-else :posts="likedPosts" />
        </div>

        <!-- Seguidos -->
        <div v-else-if="activeTab === 'following'">
          <h2 class="text-2xl font-bold text-white mb-6">Personas que sigues</h2>

          <EmptyState
            v-if="userStore.following.length === 0"
            :icon="faUserPlus"
            message="Aún no sigues a nadie"
          />

          <div v-else class="space-y-4">
            <UserList v-for="user in userStore.following" :key="user.id" :user="user" />
          </div>
        </div>

        <!-- Seguidores -->
        <div v-else-if="activeTab === 'followers'">
          <h2 class="text-2xl font-bold text-white mb-6">Tus seguidores</h2>

          <EmptyState
            v-if="userStore.followers.length === 0"
            :icon="faUsers"
            message="Aún no tienes seguidores"
          />

          <div v-else class="space-y-4">
            <UserList v-for="user in userStore.followers" :key="user.id" :user="user" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
