<template>
  <div class="app-shell">
    <nav v-if="user" class="app-nav">
      <div class="nav-left">
        <div class="logo">
          <img src="/header.png" alt="amma" />
        </div>
        <span class="nav-home" @click="navigateTo(user.role === 'admin' ? '/admin' : '/')">Início</span>
      </div>
      <div class="nav-actions">
        <span class="text-muted" style="font-size:.8rem">{{ user.username }}</span>
        <button class="btn-sm" @click="handleLogout">Sair</button>
      </div>
    </nav>

    <main :class="user ? 'app-main' : ''">
      <NuxtPage />
    </main>

    <footer v-if="user" class="app-footer">
      © {{ new Date().getFullYear() }} {{ brand.name }} — Todos os direitos reservados
    </footer>

    <AppToast />
  </div>
</template>

<script setup lang="ts">
interface User { userId: number; username: string; role: string }

const { brand } = useAppConfig()
useHead({ title: brand.name })

const { data: user } = await useFetch<User>('/api/users/me', {
  key: useRoute().path,
  default: () => undefined,
  onResponseError: () => {}
})

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST', body: {} })
  await refreshNuxtData()
  navigateTo('/auth/login')
}
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>