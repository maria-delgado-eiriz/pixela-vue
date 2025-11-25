<script setup>
import { defineProps } from 'vue'

// Props para recibir el redondeo, la sombra, el color de fondo y el tamaño
defineProps({
  rounded: {
    type: String,
    default: 'md', // Opciones: 'sm', 'md', 'lg', 'full'
  },
  shadow: {
    type: String,
    default: 'md', // Opciones: 'none', 'sm', 'md', 'lg', 'xl'
  },
  bgColor: {
    type: String,
    default: 'bg-white', // Cualquier color de fondo compatible con Tailwind
  },
  size: {
    type: String,
    default: 'md', // Opciones: 'sm', 'md', 'lg'
  },
})

// Mapear las clases de Tailwind según las props
const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

// Clases de Tailwind para redondear y sombrear el contenedor
const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

// Clases de Tailwind para agregar sombra al contenedor
const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
}
</script>

<template>
  <div
    :class="[
      sizeClasses[size],
      roundedClasses[rounded],
      shadowClasses[shadow],
      bgColor,
      'transition-all duration-300',
    ]"
  >
    <!-- Slot para el título -->
    <div v-if="$slots.title" class="mb-4">
      <slot name="title" />
    </div>

    <!-- Slot para el contenido -->
    <div v-if="$slots.content" class="mb-4">
      <slot name="content" />
    </div>

    <!-- Slot para el footer -->
    <div v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped></style>
