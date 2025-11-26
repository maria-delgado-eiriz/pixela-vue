<script setup>
import { ref, onBeforeMount } from 'vue'
import PostComponent from '../components/PostComponent.vue'
import CreatePostModal from '../components/CreatePostModal.vue'
import { useUserStore } from '../store/user.store'
import { fetchPosts } from '../api/posts.api'

const userStore = useUserStore()

// Modal state
const showCreateModal = ref(false)
const posts = ref([])
const loading = ref(true)

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleCreatePost = postData => {
  const post = {
    id: posts.value.length + 1,
    title: postData.title,
    content: postData.content,
    image: postData.image,
    author: {
      name: userStore.fullName || userStore.name || 'Usuario',
      username: userStore.username || 'usuario',
    },
  }

  posts.value.unshift(post) // Añadir al inicio
}

const loadPosts = async () => {
  try {
    loading.value = true
    const postsRes = await fetchPosts()
    posts.value = postsRes || []
    console.log('Posts cargados:', posts.value)
  } catch (error) {
    console.error('Error al cargar posts:', error)
    posts.value = []
  } finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  await loadPosts()
})
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold text-white mb-2">Últimas Publicaciones</h2>
          <p class="text-gray-400">Descubre lo último de tu comunidad</p>
        </div>

        <!-- Botón para crear nueva publicación -->
        <button
          @click="openCreateModal"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center space-x-2"
        >
          <span class="text-xl">+</span>
          <span>Nueva publicación</span>
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"
          ></div>
          <p class="text-gray-400 mt-4">Cargando publicaciones...</p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="posts.length === 0" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="mb-6">
            <svg
              class="mx-auto h-24 w-24 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">No hay publicaciones aún</h3>
          <p class="text-gray-400 mb-6">
            Sé el primero en compartir algo con la comunidad. ¡Crea tu primera publicación!
          </p>
          <button
            @click="openCreateModal"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg inline-flex items-center space-x-2"
          >
            <span class="text-xl">+</span>
            <span>Crear primera publicación</span>
          </button>
        </div>
      </div>

      <!-- Grid de posts -->
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
        />
      </div>
    </div>

    <!-- Modal para crear publicación -->
    <CreatePostModal :show="showCreateModal" @close="closeCreateModal" @create="handleCreatePost" />
  </div>
</template>

<style scoped></style>
