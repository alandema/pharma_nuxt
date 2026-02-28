<script setup lang="ts">


const name = ref('')
const information = ref('')

const submit = async () => {
  await $fetch('/api/formulas', {
    method: 'POST',
    body: { name: name.value, information: information.value }
  })
  navigateTo('/admin/formulas')
}

</script>

<template>
  <div class="page-header">
    <h1>Nova Fórmula</h1>
    <button @click="navigateTo('/admin/formulas')">← Voltar</button>
  </div>
  <div class="card">
    <form @submit.prevent="submit">
      <div class="form-group"><label>Nome *</label><input v-model="name" placeholder="Nome da fórmula" required /></div>
      <div class="form-group"><label>Informação</label><textarea v-model="information" placeholder="Detalhes da fórmula" rows="5"></textarea></div>
      <button type="submit">Salvar Fórmula</button>
    </form>
  </div>
</template>