<script setup>
import { onBeforeMount, ref } from 'vue'
import { useUserStore } from '../store/user.store'
import { followUser, unfollowUser } from '../api/users.api'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const userStore = useUserStore()

const isUserLoggedFollowing = ref(false)

const handleAction = () => {
  if (isUserLoggedFollowing.value) {
    // Lógica para dejar de seguir
    unfollowUser(props.user.id)
    isUserLoggedFollowing.value = false
  } else {
    followUser(props.user.id)
    isUserLoggedFollowing.value = true
  }
}

const getUserInitial = () => {
  return props.user.firstName?.charAt(0)?.toUpperCase() || 'U'
}

onBeforeMount(async () => {
  isUserLoggedFollowing.value = userStore.following.some(
    followedUser => followedUser.id === props.user.id
  )
})
</script>

<template>
  <div
    class="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-indigo-500/30 transition-all"
  >
    <div class="flex items-center space-x-4">
      <!-- Avatar -->
      <div
        v-if="user.imageProfile"
        class="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30"
      >
        <img :src="user.imageProfile" :alt="user.firstName" class="w-full h-full object-cover" />
      </div>
      <div
        v-else
        class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
      >
        <span class="text-white font-semibold">{{ getUserInitial() }}</span>
      </div>

      <!-- Info -->
      <div>
        <p class="text-white font-medium">{{ user.firstName }} {{ user.lastName }}</p>
        <p class="text-gray-400 text-sm">@{{ user.username }}</p>
      </div>
    </div>

    <!-- Action button -->
    <button
      @click="handleAction"
      :class="[
        'px-4 py-2 rounded-lg transition-colors text-sm',
        isUserLoggedFollowing
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'bg-indigo-600 text-white hover:bg-indigo-700',
      ]"
    >
      {{ isUserLoggedFollowing ? 'Dejar de seguir' : 'Seguir' }}
    </button>
  </div>
</template>

<style scoped></style>
