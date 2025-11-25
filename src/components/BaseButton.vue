<script setup>
import { defineProps } from 'vue'

// Props para recibir el tipo, el color, el tamaño y si está deshabilitado
const props = defineProps({
  type: {
    type: String,
    default: 'button', // Valores posibles: 'button', 'submit', 'reset'
  },
  color: {
    type: String,
    default: 'blue', // Ejemplo: 'blue', 'red', 'green', etc.
  },
  size: {
    type: String,
    default: 'md', // Opciones: 'sm', 'md', 'lg'
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Mapeamos las clases según las props de tamaño
const sizeClasses = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-4 text-md',
  lg: 'py-3 px-6 text-lg',
}

// Mapeamos las clases de color según el color pasado
const colorClasses = {
  blue: 'bg-blue-500 hover:bg-blue-600 text-white',
  red: 'bg-red-500 hover:bg-red-600 text-white',
  green: 'bg-green-500 hover:bg-green-600 text-white',
  gray: 'bg-gray-500 hover:bg-gray-600 text-white',
}
</script>

<template>
  <button
    :type="type"
    :class="[
      'rounded-lg font-semibold transition-all duration-300',
      sizeClasses[size],
      colorClasses[color],
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped></style>
