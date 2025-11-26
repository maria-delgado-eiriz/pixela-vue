<script setup>
import { useUserStore } from '../store/user.store'

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
  },
})

const userStore = useUserStore()

const handleLike = () => {
  // TODO call enpoint to like the post
  console.log('Post ID:', props.id)
  console.log('Liker:', userStore.username)
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
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
        >
          <span class="text-white font-semibold text-sm">{{ author.name.charAt(0) }}</span>
        </div>
        <div>
          <p class="text-gray-200 font-medium text-sm">{{ author.name }}</p>
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
          class="flex items-center space-x-2 hover:text-indigo-400 transition-colors"
        >
          <span>❤️</span>
          <span>Me gusta</span>
        </button>
        <button class="flex items-center space-x-2 hover:text-indigo-400 transition-colors">
          <span>💬</span>
          <span>Comentar</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
