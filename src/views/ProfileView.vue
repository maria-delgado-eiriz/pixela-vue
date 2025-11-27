<script setup>
import { ref, onBeforeMount } from 'vue'
import { useUserStore } from '../store/user.store'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEdit, faHeart, faUserPlus, faUsers, faImage } from '@fortawesome/free-solid-svg-icons'
import PostComponent from '../components/PostComponent.vue'
import { getUserProfile } from '../api/users.api'
const userStore = useUserStore()

const activeTab = ref('details')
const profileData = ref(null)
const loading = ref(true)

const likedPosts = ref([])
const following = ref([])
const followers = ref([])
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
      : userStore.fullName || userStore.name) || 'Usuario'
  )
}

onBeforeMount(async () => {
  try {
    loading.value = true
    const profile = await getUserProfile(userStore.id)
    profileData.value = profile

    if (profile.likedPosts) likedPosts.value = profile.likedPosts
    if (profile.following) following.value = profile.following
    if (profile.followers) followers.value = profile.followers
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
              <span class="text-white font-semibold">{{ followers.length }}</span>
              <span class="text-gray-400 ml-1">Seguidores</span>
            </div>
            <div>
              <span class="text-white font-semibold">{{ following.length }}</span>
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

          <div v-if="posts.length === 0" class="text-center py-12">
            <FontAwesomeIcon :icon="faImage" class="text-6xl text-gray-600 mb-4" />
            <p class="text-gray-400">Aún no tienes ninguna publicación</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PostComponent
              v-for="post in posts"
              :key="post.id"
              :id="post.id"
              :image="post.image"
              :title="post.title"
              :content="post.content"
              :username="post.username"
              :fullName="post.firstName + ' ' + post.lastName"
              :likesCount="post.likesCount"
              :isLikedByUser="post.isLikedByUser"
            />
          </div>
        </div>

        <!-- Me gusta -->
        <div v-else-if="activeTab === 'likes'">
          <h2 class="text-2xl font-bold text-white mb-6">Posts que me gustan</h2>

          <div v-if="likedPosts.length === 0" class="text-center py-12">
            <FontAwesomeIcon :icon="faHeart" class="text-6xl text-gray-600 mb-4" />
            <p class="text-gray-400">Aún no has dado like a ninguna publicación</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PostComponent
              v-for="post in likedPosts"
              :key="post.id"
              :id="post.id"
              :image="post.image"
              :title="post.title"
              :content="post.content"
              :username="post.username"
              :fullName="post.firstName + ' ' + post.lastName"
              :likesCount="post.likesCount"
              :isLikedByUser="post.isLikedByUser"
            />
          </div>
        </div>

        <!-- Seguidos -->
        <div v-else-if="activeTab === 'following'">
          <h2 class="text-2xl font-bold text-white mb-6">Personas que sigues</h2>

          <div v-if="following.length === 0" class="text-center py-12">
            <FontAwesomeIcon :icon="faUserPlus" class="text-6xl text-gray-600 mb-4" />
            <p class="text-gray-400">Aún no sigues a nadie</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="user in following"
              :key="user.id"
              class="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-indigo-500/30 transition-all"
            >
              <div class="flex items-center space-x-4">
                <div
                  class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                >
                  <span class="text-white font-semibold">{{ user.firstName.charAt(0) }}</span>
                </div>
                <div>
                  <p class="text-white font-medium">{{ user.firstName + ' ' + user.lastName }}</p>
                  <p class="text-gray-400 text-sm">@{{ user.username }}</p>
                </div>
              </div>
              <button
                class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Dejar de seguir
              </button>
            </div>
          </div>
        </div>

        <!-- Seguidores -->
        <div v-else-if="activeTab === 'followers'">
          <h2 class="text-2xl font-bold text-white mb-6">Tus seguidores</h2>

          <div v-if="followers.length === 0" class="text-center py-12">
            <FontAwesomeIcon :icon="faUsers" class="text-6xl text-gray-600 mb-4" />
            <p class="text-gray-400">Aún no tienes seguidores</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="user in followers"
              :key="user.id"
              class="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-indigo-500/30 transition-all"
            >
              <div class="flex items-center space-x-4">
                <div
                  class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                >
                  <span class="text-white font-semibold">{{ user.firstName.charAt(0) }}</span>
                </div>
                <div>
                  <p class="text-white font-medium">{{ user.firstName + ' ' + user.lastName }}</p>
                  <p class="text-gray-400 text-sm">@{{ user.username }}</p>
                </div>
              </div>
              <button
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                Seguir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
