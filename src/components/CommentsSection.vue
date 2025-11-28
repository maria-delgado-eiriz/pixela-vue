<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { getPostComments, createComment } from '../api/posts.api'
import { useUserStore } from '../store/user.store'
import ProfileImage from './ProfileImage.vue'
import { getUserFullName } from '../utils/formaters'

const userStore = useUserStore()

const props = defineProps({
  postId: {
    type: [Number, String],
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['commentsLoaded'])

const comments = ref([])
const newComment = ref('')
const loadingComments = ref(false)
const sendingComment = ref(false)
const hasLoadedComments = ref(false)
const displayedComments = ref(5)

// Cargar comentarios cuando se hace visible
const loadComments = async () => {
  if (hasLoadedComments.value) return

  try {
    loadingComments.value = true
    const response = await getPostComments(props.postId)
    // Ordenar de más nuevo a más viejo
    comments.value = response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    hasLoadedComments.value = true
    emit('commentsLoaded', comments.value.length)
  } catch (error) {
    console.error('Error al cargar comentarios:', error)
  } finally {
    loadingComments.value = false
  }
}

// Función para formatear la fecha
const formatDate = dateString => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// Función para cargar más comentarios
const loadMoreComments = () => {
  displayedComments.value += 5
}

// Exponer la función para que el componente padre pueda llamarla
defineExpose({
  loadComments,
})

const handleSendComment = async () => {
  if (!newComment.value.trim()) return

  try {
    sendingComment.value = true
    const response = await createComment(props.postId, newComment.value)

    // Añadir el comentario a la lista local
    comments.value.unshift({
      id: response.id,
      content: newComment.value,
      author: {
        username: userStore.username,
        firstName: userStore.firstName,
        lastName: userStore.lastName,
        profileImage: userStore.image,
      },
      createdAt: new Date().toISOString(),
    })

    emit('commentsLoaded', comments.value.length)
    newComment.value = ''
  } catch (error) {
    console.error('Error al enviar comentario:', error)
    alert('Error al enviar el comentario')
  } finally {
    sendingComment.value = false
  }
}
</script>

<template>
  <div v-if="isVisible" class="mt-4 pt-4 border-t border-gray-700/50">
    <!-- Formulario para nuevo comentario -->
    <div class="flex items-start space-x-3 mb-4">
      <ProfileImage
        :firstName="userStore.fullName"
        :profileImage="userStore.image"
        class="flex-shrink-0"
      />
      <div class="flex-1">
        <textarea
          v-model="newComment"
          placeholder="Escribe un comentario..."
          class="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
          rows="2"
          @keydown.ctrl.enter="handleSendComment"
        ></textarea>
        <div class="flex justify-end mt-2">
          <button
            @click="handleSendComment"
            :disabled="!newComment.trim() || sendingComment"
            class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FontAwesomeIcon :icon="faPaperPlane" />
            <span>{{ sendingComment ? 'Enviando...' : 'Enviar' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de comentarios -->
    <div v-if="loadingComments" class="text-center py-4">
      <span class="text-gray-500 text-sm">Cargando comentarios...</span>
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-4">
      <span class="text-gray-500 text-sm">No hay comentarios aún. ¡Sé el primero en comentar!</span>
    </div>

    <div v-else class="space-y-4 max-h-96 overflow-y-auto">
      <div
        v-for="comment in comments.slice(0, displayedComments)"
        :key="comment.id"
        class="flex items-start space-x-3"
      >
        <ProfileImage
          :firstName="comment.author.firstName"
          :profileImage="comment.author.profileImage"
          class="flex-shrink-0"
        />
        <div class="flex-1 bg-gray-900/30 rounded-lg px-3 py-2">
          <div class="flex items-baseline space-x-2 mb-1">
            <span class="text-gray-200 font-medium text-sm">{{
              getUserFullName(comment.author.firstName, comment.author.lastName)
            }}</span>
            <span class="text-gray-500 text-xs">@{{ comment.author.username }}</span>
            <span class="text-gray-500 text-xs">· {{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="text-gray-300 text-sm">{{ comment.content }}</p>
        </div>
      </div>

      <!-- Botón para cargar más comentarios -->
      <div v-if="comments.length > displayedComments" class="text-center pt-2">
        <button
          @click="loadMoreComments"
          class="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          Cargar más comentarios ({{ comments.length - displayedComments }} restantes)
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
