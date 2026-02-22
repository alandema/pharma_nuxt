<script setup lang="ts">
const username = ref('')
const password = ref('')
const handleSubmit = async () => {
  try {
    const data = await $fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
  } catch (error) {
    console.error('Error during signup:', error)
  }

  await navigateTo('/auth/login')
}

</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="username" type="text" placeholder="Usuário" required />
    <input v-model="password" type="password" placeholder="Senha" required />
    <button type="submit">Cadastrar</button>
  </form>
  <button @click="navigateTo('/auth/login')">Já tem uma conta? Entrar</button>
</template>