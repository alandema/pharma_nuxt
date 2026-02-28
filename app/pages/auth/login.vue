<script setup lang="ts">
const username = ref('')
const password = ref('')
const { add: addToast } = useToast()

const { brand } = useAppConfig()

const handleSubmit = async () => {
  try {
    const res = await $fetch<{ message: string }>('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    addToast(res.message, 'success')
    await refreshNuxtData()
    await navigateTo('/')
  } catch (err: any) {
    addToast(err.data?.message ?? 'Algo deu errado', 'error')
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="card auth-card">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:48px;height:48px;margin:0 auto .5rem">
        <rect width="100" height="100" rx="18" fill="#2563eb"/>
        <text x="50" y="70" font-family="serif" font-size="58" font-weight="bold" fill="#fff" text-anchor="middle">Rx</text>
      </svg>
      <h1>{{ brand.name }}</h1>
      <p class="text-muted auth-sub">{{ brand.subtitle }}</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Usuário</label>
          <input v-model="username" type="text" placeholder="Digite seu usuário" required />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input v-model="password" type="password" placeholder="Digite sua senha" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p class="auth-link"><NuxtLink to="/auth/signup">Não tem conta? Cadastre-se</NuxtLink></p>
    </div>
  </div>
</template>