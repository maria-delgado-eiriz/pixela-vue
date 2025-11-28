<script setup>
import { getUserFullName } from '../utils/formaters'
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
      :author="{
        username: post.author.username,
        fullName: getUserFullName(post.author.firstName, post.author.lastName),
        profileImage: post.author.profileImage,
      }"
      :likesCount="post.likesCount"
      :isLikedByUser="post.isLikedByUser"
    />
  </div>
</template>

<style scoped></style>
