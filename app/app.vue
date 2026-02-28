<template>
  <nav v-if="user" class="app-nav">
    <div class="logo" @click="navigateTo(user.role === 'admin' ? '/admin' : '/')">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="18" fill="#2563eb"/>
        <text x="50" y="70" font-family="serif" font-size="58" font-weight="bold" fill="#fff" text-anchor="middle">Rx</text>
      </svg>
      {{ brand.name }}
    </div>
    <div class="nav-actions">
      <span class="text-muted" style="font-size:.8rem">{{ user.username }}</span>
      <button class="btn-sm" @click="handleLogout">Sair</button>
    </div>
  </nav>

  <main class="app-main">
    <NuxtPage />
  </main>

  <AppToast />
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