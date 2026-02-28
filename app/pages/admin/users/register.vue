<script setup lang="ts">
const username = ref('')
const password = ref('')
const role = ref('prescritor')
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
  <div class="page-header">
    <h1>Novo Usuário</h1>
    <button @click="navigateTo('/admin/users')">← Voltar</button>
  </div>
  <div class="card">
    <form @submit.prevent="handleSubmit">
      <div class="form-group"><label>Usuário *</label><input v-model="username" type="text" placeholder="Nome de usuário" required /></div>
      <div class="form-group"><label>Senha *</label><input v-model="password" type="password" placeholder="Senha" required /></div>
      <div class="form-group">
        <label>Função *</label>
        <select v-model="role" required>
          <option value="prescritor">Prescritor</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <button type="submit">Criar Usuário</button>
    </form>
  </div>
</template>