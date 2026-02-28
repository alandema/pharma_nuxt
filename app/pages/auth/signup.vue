<script setup lang="ts">
const username = ref('')
const password = ref('')
const { add: addToast } = useToast()

const handleSubmit = async () => {
  try {
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    addToast('Conta criada com sucesso!', 'success')
    await navigateTo('/auth/login')
  } catch (err: any) {
    addToast(err.data?.message ?? 'Erro ao cadastrar', 'error')
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="card auth-card">
      <h1>Criar Conta</h1>
      <p class="text-muted auth-sub">Preencha os dados para se cadastrar</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Usuário</label>
          <input v-model="username" type="text" placeholder="Escolha um usuário" required />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input v-model="password" type="password" placeholder="Escolha uma senha" required />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      <p class="auth-link"><NuxtLink to="/auth/login">Já tem conta? Entrar</NuxtLink></p>
    </div>
  </div>
</template>