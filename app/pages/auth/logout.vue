<template>
  <div class="auth-page">
    <div class="card auth-card">
      <h1>Sair</h1>
      <p class="text-muted auth-sub">Tem certeza que deseja sair?</p>
      <button class="btn-primary" @click="handleLogout" :disabled="loading">
        {{ loading ? 'Saindo...' : 'Confirmar Saída' }}
      </button>
      <p v-if="error" style="color:var(--c-danger);margin-top:.5rem">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)
const error = ref(null)

definePageMeta({ middleware: ['user-pages-middleware'] })

const handleLogout = async () => {
  loading.value = true
  error.value = null
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
  } catch (e) {
    console.error('Error during logout:', e)
  } finally {
    loading.value = false
  }
  navigateTo('/')
}
</script>