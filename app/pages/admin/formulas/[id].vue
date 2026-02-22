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
  <h1>Detalhes da Fórmula</h1>
  <form @submit.prevent="save">
    <input v-model="name" placeholder="Nome" required />
    <textarea v-model="information" placeholder="Informação"></textarea>
    <button type="submit">Salvar</button>
  </form>
  <button @click="navigateTo('/admin/formulas')">Voltar para Fórmulas</button>
</template>