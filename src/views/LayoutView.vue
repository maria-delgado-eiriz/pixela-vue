<script setup lang="js">
import { RouterView, useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHome,
  faUser,
  faSignOutAlt,
  faComments,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { ref, onBeforeMount } from "vue";
import { useUserStore } from "../store/user.store";
import { jwtDecode } from "jwt-decode";
import { useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const mobileMenuOpen = ref(false);

const logout = () => {
  localStorage.removeItem("token");
  router.push({ name: "login" });
};

const goToProfile = () => {
  router.push({ name: "profile", params: { id: userStore.Id } });
  if (route.name === "profile") setTimeout(() => router.go(0), 100);
};

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
</script>

<template>
  <div class="min-h-screen w-full bg-gray-100 flex flex-col">
    <!-- NAVBAR -->
    <header class="w-full bg-slate-700 text-white shadow-lg fixed top-0 left-0 z-20">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <!-- LOGO -->
        <h1 class="text-xl md:text-2xl font-bold">SnapConnect</h1>

        <!-- DESKTOP MENU -->
        <nav class="hidden md:flex items-center space-x-6 text-gray-200">
          <router-link to="/" class="hover:text-white flex items-center space-x-2">
            <FontAwesomeIcon :icon="faHome" />
            <span>Home</span>
          </router-link>

          <a
            @click="goToProfile()"
            class="hover:text-white flex items-center space-x-2 cursor-pointer"
          >
            <FontAwesomeIcon :icon="faUser" />
            <span>Profile</span>
          </a>

          <router-link to="/search" class="hover:text-white flex items-center space-x-2">
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
            <span>Buscar</span>
          </router-link>

          <router-link to="/chats" class="hover:text-white flex items-center space-x-2">
            <FontAwesomeIcon :icon="faComments" />
            <span>Chat</span>
          </router-link>

          <a
            @click="logout()"
            class="hover:text-red-400 flex items-center space-x-2 cursor-pointer"
          >
            <FontAwesomeIcon :icon="faSignOutAlt" />
            <span>Logout</span>
          </a>
        </nav>

        <!-- MOBILE BUTTON -->
        <button class="md:hidden text-white" @click="mobileMenuOpen = !mobileMenuOpen">
          <FontAwesomeIcon :icon="mobileMenuOpen ? faXmark : faBars" class="w-6 h-6" />
        </button>
      </div>

      <!-- MOBILE MENU DROPDOWN -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-slate-700 text-gray-200 flex flex-col space-y-4 px-6 py-4"
      >
        <router-link
          @click="mobileMenuOpen = false"
          to="/"
          class="hover:text-white flex items-center space-x-2"
        >
          <FontAwesomeIcon :icon="faHome" />
          <span>Home</span>
        </router-link>

        <a
          @click="goToProfile(), (mobileMenuOpen = false)"
          class="hover:text-white flex items-center space-x-2 cursor-pointer"
        >
          <FontAwesomeIcon :icon="faUser" />
          <span>Profile</span>
        </a>

        <router-link
          @click="mobileMenuOpen = false"
          to="/search"
          class="hover:text-white flex items-center space-x-2"
        >
          <FontAwesomeIcon :icon="faMagnifyingGlass" />
          <span>Buscar</span>
        </router-link>

        <router-link
          @click="mobileMenuOpen = false"
          to="/chats"
          class="hover:text-white flex items-center space-x-2"
        >
          <FontAwesomeIcon :icon="faComments" />
          <span>Chat</span>
        </router-link>

        <a
          @click="logout(), (mobileMenuOpen = false)"
          class="hover:text-red-400 flex items-center space-x-2 cursor-pointer"
        >
          <FontAwesomeIcon :icon="faSignOutAlt" />
          <span>Logout</span>
        </a>
      </div>
    </header>

    <!-- MAIN CONTENT (con margen para la navbar fija) -->
    <main class="pt-[80px] flex-1 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
