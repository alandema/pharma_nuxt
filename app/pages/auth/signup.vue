<script setup lang="ts">
const username = ref('')
const password = ref('')
const handleSubmit = async () => {
  try {
    const data = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    console.log('Signup successful:', data)
  } catch (error) {
    console.error('Error during signup:', error)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="username" type="text" placeholder="Username" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Sign Up</button>
  </form>
</template>