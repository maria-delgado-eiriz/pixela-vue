<script setup>
import { ref } from 'vue'
import PostComponent from '../components/PostComponent.vue'

// TODO - atacar a la API para poder traer los posts reales
// Mock data de posts
const posts = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    title: 'Explorando las montañas del norte',
    content:
      'Una increíble aventura por las montañas más altas. La vista desde la cima era absolutamente espectacular, con nubes a nuestros pies y un cielo azul infinito. Una experiencia que jamás olvidaré.',
    author: {
      name: 'María García',
      username: 'maria_travels',
    },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1682687221038-404cb8830901',
    title: 'Atardecer en la playa',
    content:
      'Los colores del atardecer pintando el cielo de naranja y rosa. El sonido de las olas rompiendo suavemente en la orilla. Momentos perfectos que nos recuerdan la belleza de la naturaleza.',
    author: {
      name: 'Carlos Ruiz',
      username: 'carlos_photo',
    },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
    title: 'Gastronomía urbana',
    content:
      'Descubriendo los mejores sabores de la ciudad. Cada bocado es una historia, cada plato una obra de arte culinaria. La comida callejera tiene un encanto especial que no se puede replicar.',
    author: {
      name: 'Ana López',
      username: 'foodie_ana',
    },
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b',
    title: 'Arquitectura moderna',
    content:
      'Las líneas y formas de los edificios contemporáneos creando un paisaje urbano único. La arquitectura moderna desafía la gravedad y nuestra imaginación con estructuras innovadoras.',
    author: {
      name: 'David Torres',
      username: 'archi_david',
    },
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb',
    title: 'Vida silvestre en su hábitat',
    content:
      'Observando la naturaleza en su estado más puro. Los animales en libertad nos muestran comportamientos fascinantes que solo podemos apreciar cuando respetamos su espacio.',
    author: {
      name: 'Laura Martín',
      username: 'wildlife_laura',
    },
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
    title: 'Café y reflexiones',
    content:
      'Momentos de tranquilidad en mi cafetería favorita. El aroma del café recién hecho, un buen libro y tiempo para pensar. A veces lo simple es lo más valioso.',
    author: {
      name: 'Pedro Sánchez',
      username: 'pedro_coffee',
    },
  },
])
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">Últimas Publicaciones</h2>
        <p class="text-gray-400">Descubre lo último de tu comunidad</p>
      </div>

      <!-- Grid de posts -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PostComponent
          v-for="post in posts"
          :key="post.id"
          :id="post.id"
          :image="post.image"
          :title="post.title"
          :content="post.content"
          :author="post.author"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
