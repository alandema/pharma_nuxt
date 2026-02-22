<script setup lang="ts">
const username = ref('')
const password = ref('')
const role = ref('user')
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
        role: role.value,
      }),
    })
  } catch (error) {
    console.error('Error during signup:', error)
  }

  await navigateTo('/admin/users')
}

</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="username" type="text" placeholder="Usuário" required />
    <input v-model="password" type="password" placeholder="Senha" required />
    <select v-model="role" required>
      <option value="user">Usuário</option>
      <option value="admin">Administrador</option>
    </select>
    <button type="submit">Criar Usuário</button>
  </form>
  <button @click="navigateTo('/admin/users')">Voltar para a Lista de Usuários</button>
</template>