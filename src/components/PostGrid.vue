<script setup>
import PostComponent from './PostComponent.vue'

defineProps({
  posts: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PostComponent
      v-for="post in posts"
      :key="post.id"
      :id="post.id"
      :image="post.image"
      :title="post.title"
      :content="post.content"
      :username="post.username"
      :fullName="`${post.firstName} ${post.lastName}`"
      :likesCount="post.likesCount"
      :isLikedByUser="post.isLikedByUser"
    />
  </div>
</template>

<style scoped></style>
