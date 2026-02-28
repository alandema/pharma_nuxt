<script setup lang="ts">


type Formula = { id: string; name: string; information?: string }

const route = useRoute()
const { data: formula, refresh } = await useFetch<Formula>(`/api/formulas/${route.params.id}`, {
  method: 'GET'
})

const name = ref(formula.value?.name || '')
const information = ref(formula.value?.information || '')

const save = async () => {
  await $fetch(`/api/formulas/${route.params.id}`, {
    method: 'PUT',
    body: { name: name.value, information: information.value }
  })
  refresh()
  await navigateTo('/admin/formulas')
}
</script>

<template>
  <div class="page-header">
    <h1>Editar Fórmula</h1>
    <button @click="navigateTo('/admin/formulas')">← Voltar</button>
  </div>
  <div class="card">
    <form @submit.prevent="save">
      <div class="form-group"><label>Nome *</label><input v-model="name" placeholder="Nome da fórmula" required /></div>
      <div class="form-group"><label>Informação</label><textarea v-model="information" placeholder="Detalhes da fórmula" rows="5"></textarea></div>
      <button type="submit">Salvar Alterações</button>
    </form>
  </div>
</template>