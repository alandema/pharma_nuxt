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
  <form @submit.prevent="submit">
    <input v-model="name" placeholder="Nome" required />
    <textarea v-model="information" placeholder="Informação"></textarea>
    <button type="submit">Salvar</button>
  </form>
  <div>
    <button @click="navigateTo('/admin/formulas')">Voltar para a Lista de Fórmulas</button>
  </div>
</template>