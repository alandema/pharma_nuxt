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
    <input v-model="name" placeholder="Name" required />
    <textarea v-model="information" placeholder="Information"></textarea>
    <button type="submit">Save</button>
  </form>
  <div>
    <button @click="navigateTo('/admin/formulas')">Back to Formula List</button>
  </div>
</template>