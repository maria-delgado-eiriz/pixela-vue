<script setup>
import { ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHeart as faHeartSolid,
  faCommentDots,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { likePost, unlikePost, getPostComments, createComment } from '../api/posts.api'
import { useUserStore } from '../store/user.store'
import ProfileImage from './ProfileImage.vue'

const userStore = useUserStore()

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
    validator: value => {
      return value.username && value.fullName
    },
  },
  likesCount: {
    type: Number,
    required: false,
    default: 0,
  },
  isLikedByUser: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const localLikesCount = ref(props.likesCount)
const localIsLiked = ref(props.isLikedByUser)
const showComments = ref(false)
const comments = ref([])
const newComment = ref('')
const loadingComments = ref(false)
const sendingComment = ref(false)

// Sincronizar con las props si cambian
watch(
  () => props.likesCount,
  newVal => {
    localLikesCount.value = newVal
  }
)

watch(
  () => props.isLikedByUser,
  newVal => {
    localIsLiked.value = newVal
  }
)

const handleLike = async () => {
  if (localIsLiked.value) {
    await unlikePost(props.id)
    localLikesCount.value--
    localIsLiked.value = false
  } else {
    await likePost(props.id)
    localLikesCount.value++
    localIsLiked.value = true
  }
}

const toggleComments = async () => {
  showComments.value = !showComments.value

  if (showComments.value && comments.value.length === 0) {
    await loadComments()
  }
}

const loadComments = async () => {
  try {
    loadingComments.value = true
    const response = await getPostComments(props.id)
    console.log('Comentarios cargados:', response)
    comments.value = response
  } catch (error) {
    console.error('Error al cargar comentarios:', error)
  } finally {
    loadingComments.value = false
  }
}

const handleSendComment = async () => {
  if (!newComment.value.trim()) return

  try {
    sendingComment.value = true
    const response = await createComment(props.id, newComment.value)
    // Añadir el comentario a la lista local
    comments.value.unshift({
      id: response.id,
      content: newComment.value,
      author: {
        username: userStore.username,
        fullName: userStore.fullName,
        image: userStore.image,
      },
      createdAt: new Date().toISOString(),
    })

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
  <article
    class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/20 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
  >
    <!-- Imagen del post -->
    <div class="relative h-64 overflow-hidden bg-gray-900">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      />
    </div>

    <!-- Contenido del post -->
    <div class="p-6">
      <!-- Autor -->
      <div class="flex items-center space-x-3 mb-4">
        <ProfileImage :firstName="author.fullName" :profileImage="author.profileImage" />
        <div>
          <p class="text-gray-200 font-medium text-sm">{{ author.fullName }}</p>
          <p class="text-gray-500 text-xs">@{{ author.username }}</p>
        </div>
      </div>

      <!-- Título -->
      <h3 class="text-xl font-bold text-white mb-2 line-clamp-2">
        {{ title }}
      </h3>

      <!-- Contenido -->
      <p class="text-gray-400 text-sm line-clamp-3 mb-4">
        {{ content }}
      </p>

      <!-- Acciones -->
      <div
        class="flex items-center space-x-4 text-gray-500 text-sm pt-4 border-t border-gray-700/50"
      >
        <button
          @click="handleLike"
          :class="[
            'flex items-center space-x-2 transition-colors',
            localIsLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-indigo-400',
          ]"
        >
          <FontAwesomeIcon :icon="localIsLiked ? faHeartSolid : faHeartRegular" />
          <span>{{ localLikesCount }}</span>
        </button>
        <button
          @click="toggleComments"
          :class="[
            'flex items-center space-x-2 transition-colors',
            showComments ? 'text-indigo-400' : 'hover:text-indigo-400',
          ]"
        >
          <FontAwesomeIcon :icon="faCommentDots" />
          <span>{{ comments.length > 0 ? comments.length : 'Comentar' }}</span>
        </button>
      </div>

      <!-- Sección de comentarios -->
      <div v-if="showComments" class="mt-4 pt-4 border-t border-gray-700/50">
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
          <span class="text-gray-500 text-sm"
            >No hay comentarios aún. ¡Sé el primero en comentar!</span
          >
        </div>

        <div v-else class="space-y-4 max-h-96 overflow-y-auto">
          <div v-for="comment in comments" :key="comment.id" class="flex items-start space-x-3">
            <ProfileImage
              :firstName="comment.author.firstName"
              :profileImage="comment.author.profileImage"
              class="flex-shrink-0"
            />
            <div class="flex-1 bg-gray-900/30 rounded-lg px-3 py-2">
              <div class="flex items-baseline space-x-2 mb-1">
                <span class="text-gray-200 font-medium text-sm">{{
                  comment.author.firstName + ' ' + comment.author.lastName
                }}</span>
                <span class="text-gray-500 text-xs">@{{ comment.author.username }}</span>
              </div>
              <p class="text-gray-300 text-sm">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
