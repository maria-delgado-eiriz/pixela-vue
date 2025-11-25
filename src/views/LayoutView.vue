<script setup lang="js">
import { RouterView, useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHome,
  faUser,
  faSignOutAlt,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ref, onMounted, onUnmounted, onBeforeMount } from "vue";
import { useUserStore } from "../store/user.store";
import { jwtDecode } from "jwt-decode";
import { useRoute } from "vue-router";

const route = useRoute();
const sidebarOpen = ref(false); // Controla si la barra lateral está abierta o no
const router = useRouter();
const userStore = useUserStore();
// Función para cambiar el estado de la barra lateral

const logout = () => {
  localStorage.removeItem("token");
  router.go({ name: "login" });
};

const goToProfile = () => {
  router.push({ name: "profile", params: { id: userStore.Id } });
  if (route.name === "profile") setTimeout(() => router.go(0), 100);
};

// Detectar el tamaño de la ventana y ajustar la visibilidad de la barra lateral
const handleResize = () => {
  if (window.innerWidth > 768) {
    sidebarOpen.value = true; // Mostrar siempre la barra lateral en pantallas grandes
  } else {
    sidebarOpen.value = false; // Ocultar la barra lateral en pantallas pequeñas por defecto
  }
};

// Ejecutamos esta función cuando el componente está montado y escuchamos cambios de tamaño
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeMount(() => {
  if (!localStorage.getItem("token")) {
    router.push({ name: "login" });
  } else {
    let token = localStorage.getItem("token");
    const isExpired = Date.now() >= jwtDecode(token).exp * 1000;
    if (isExpired) {
      localStorage.removeItem("token");
      router.push({ name: "login" });
    } else {
      let tokenDecoded = jwtDecode(token);
      userStore.setUser(tokenDecoded);
    }
  }
});

// Limpiamos el event listener cuando el componente se desmonta
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div class="flex h-screen w-screen flex-col md:flex-row">
    <!-- Sidebar (desktop) / Bottom bar (mobile) -->
    <nav
      :class="[
        'md:relative transition-all duration-300 bg-slate-700 z-10',
        sidebarOpen ? 'w-full md:w-72' : 'w-0',
        'fixed md:flex-col bottom-0 md:bottom-auto md:top-0 md:left-0 md:h-screen flex justify-around md:items-center py-4 md:py-8',
      ]"
    >
      <!-- Logo (Only visible on desktop) -->
      <div class="hidden md:block mb-10" v-if="sidebarOpen">
        <h1 class="text-white text-2xl font-bold">SnapConnect</h1>
      </div>

      <!-- Navigation Links -->
      <ul class="hidden md:flex md:flex-col justify-between md:space-y-6 w-full text-center">
        <li class="w-full">
          <router-link
            to="/"
            class="flex justify-center md:flex-row md:justify-start items-center space-x-2 md:px-6 py-3 text-gray-300 hover:bg-slate-600 hover:text-white rounded-lg"
          >
            <FontAwesomeIcon :icon="faHome" class="w-5 h-5" />
            <span class="text-lg hidden md:block">Home</span>
          </router-link>
        </li>
        <li class="w-full">
          <a
            @click="goToProfile()"
            class="flex justify-center md:flex-row md:justify-start items-center space-x-2 md:px-6 py-3 text-gray-300 hover:bg-slate-600 hover:text-white rounded-lg"
          >
            <FontAwesomeIcon :icon="faUser" class="w-5 h-5" />
            <span class="text-lg hidden md:block">Profile</span>
          </a>
        </li>
        <li class="w-full">
          <router-link
            to="/search"
            class="flex justify-center md:flex-row md:justify-start items-center space-x-2 md:px-6 py-3 text-gray-300 hover:bg-slate-600 hover:text-white rounded-lg"
          >
            <FontAwesomeIcon :icon="faMagnifyingGlass" class="w-5 h-5" />
            <span class="text-lg hidden md:block">Buscar</span>
          </router-link>
        </li>
        <li class="w-full">
          <router-link
            to="/chats"
            class="flex justify-center md:flex-row md:justify-start items-center space-x-2 md:px-6 py-3 text-gray-300 hover:bg-slate-600 hover:text-white rounded-lg"
          >
            <FontAwesomeIcon :icon="faComments" class="w-5 h-5" />
            <span class="text-lg hidden md:block">Chat</span>
          </router-link>
        </li>
      </ul>

      <!-- Logout Button -->
      <div class="mt-auto hidden md:block" v-if="sidebarOpen">
        <a
          @click="logout()"
          class="w-full flex items-center space-x-4 px-6 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg"
        >
          <FontAwesomeIcon :icon="faSignOutAlt" class="w-5 h-5" />
          <span class="text-lg">Logout</span>
        </a>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="md:h-screen h-[calc(100vh-80px)] w-full bg-gray-100 overflow-y-auto">
      <!-- Se ha quitado p-6 -->
      <router-view />
    </div>

    <!-- Bottom Bar for Mobile -->
    <div
      class="md:hidden fixed bottom-0 left-0 w-full bg-slate-700 flex justify-around py-4 h-[80px]"
    >
      <router-link to="/" class="flex flex-col items-center text-gray-300 hover:text-white">
        <FontAwesomeIcon :icon="faHome" class="w-6 h-6" />
        <span class="text-xs">Home</span>
      </router-link>
      <a @click="goToProfile()" class="flex flex-col items-center text-gray-300 hover:text-white">
        <FontAwesomeIcon :icon="faUser" class="w-6 h-6" />
        <span class="text-xs">Profile</span>
      </a>
      <router-link to="/search" class="flex flex-col items-center text-gray-300 hover:text-white">
        <FontAwesomeIcon :icon="faMagnifyingGlass" class="w-6 h-6" />
        <span class="text-xs">Buscar</span>
      </router-link>
      <router-link to="/chats" class="flex flex-col items-center text-gray-300 hover:text-white">
        <FontAwesomeIcon :icon="faComments" class="w-6 h-6" />
        <span class="text-xs">Chat</span>
      </router-link>
      <a @click="logout()" class="flex flex-col items-center text-gray-300 hover:text-white">
        <FontAwesomeIcon :icon="faSignOutAlt" class="w-6 h-6" />
        <span class="text-xs">Logout</span>
      </a>
    </div>
  </div>
</template>

<style scoped></style>
