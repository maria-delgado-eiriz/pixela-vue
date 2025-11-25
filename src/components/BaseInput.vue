<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

// Props para recibir el valor del input, la etiqueta, el placeholder, el tipo, si es requerido, si está deshabilitado, si es de solo lectura, el mensaje de error y el tamaño
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
  },
})

const input = ref(props.modelValue)
// Estado para controlar la visibilidad de la contraseña
const showPassword = ref(false)

// Función para alternar la visibilidad de la contraseña
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="relative my-4">
    <label :for="props.label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ props.label }}
    </label>
    <div class="relative">
      <input
        v-model="props.modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :id="props.label"
        :name="props.label"
        :type="props.type === 'password' && showPassword ? 'text' : props.type"
        :placeholder="props.placeholder"
        :required="props.required"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :class="{
          'block w-full rounded-lg py-2 px-4 border focus:ring focus:ring-opacity-50': true,
          'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500':
            props.error,
          'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500': !props.error,
          'opacity-50 cursor-not-allowed': props.disabled,
        }"
        class="block w-full rounded-lg py-2 px-4"
      />
      <!-- Password visibility toggle -->
      <button
        v-if="props.type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
      >
        <FontAwesomeIcon :icon="showPassword ? faEyeSlash : faEye" class="h-5 w-5" />
      </button>
    </div>
    <!-- Error message -->
    <p v-if="props.error" class="mt-2 text-sm text-red-600">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped></style>
