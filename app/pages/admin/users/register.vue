<script setup lang="ts">
const username = ref('')
const password = ref('')
const role = ref('prescritor')
const { add: addToast } = useToast()

const usernameRegex = /^[a-z0-9_]+$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

const handleSubmit = async () => {
  if (!usernameRegex.test(username.value) || username.value.length > 25) {
    return addToast('Usuário inválido', 'error')
  }
  if (!passwordRegex.test(password.value) || password.value.length > 25) {
    return addToast('Senha inválida', 'error')
  }

  try {
    await $fetch('/api/users/admin', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
        role: role.value,
      },
    })
    addToast('Usuário criado com sucesso!', 'success')
  } catch (error) {
    addToast((error as any)?.data?.message ?? 'Erro ao criar usuário', 'error')
    return
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
      <div class="form-group"><label>Usuário *</label><input v-model="username" type="text" placeholder="nome_do_usuario" title="Apenas letras minúsculas, números e '_'" pattern="[a-z0-9_]+" maxlength="25" required /></div>
      <div class="form-group"><label>Senha *</label><input v-model="password" type="password" placeholder="senhaforte123" title="Mínimo 8 caracteres, incluindo letras e números" minlength="8" maxlength="25" required /></div>
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