<script setup lang="ts">
type UserParams = { email: string, send_email: boolean, password?: string }
const { data: me } = await useFetch<any>('/api/users/me')
const form = reactive({ email: '', send_email: true, password: '' })
const successMessage = ref('')

if (me.value) {
  form.email = me.value.email || ''
  form.send_email = me.value.send_email !== false
}

const save = async () => {
  successMessage.value = ''
  await $fetch('/api/users/me', { method: 'PUT', body: form })
  successMessage.value = 'Configurações atualizadas!'
}
</script>

<template>
  <div class="page-header">
    <h1>Meu Perfil</h1>
  </div>
  <div class="card" style="max-width: 600px">
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <form @submit.prevent="save">
      <div class="form-group">
        <label>E-mail</label>
        <input v-model="form.email" type="email" placeholder="seu@email.com" />
      </div>
      <div class="form-group" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
        <input type="checkbox" id="se_me" v-model="form.send_email" />
        <label for="se_me" style="margin:0">Receber e-mails de cópia das prescrições</label>
      </div>
      <button type="submit">Salvar Perfil</button>
    </form>
  </div>
</template>