<script setup lang="ts">
const username = ref('')
const password = ref('')
const handleSubmit = async () => {
  try {
    console.log('Attempting to log in with:', { username: username.value, password: password.value })
    await $fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
    
    // Redirect to home page after successful login
    await refreshNuxtData() // Clears all useFetch caches
    await navigateTo('/')
  } catch (error) {
    console.error('Error during login:', error)
  }
}

</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="username" type="text" placeholder="Username" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button loading-auto type="submit">Sign In</button>
  </form>

  <button @click="navigateTo('/auth/signup')">Go to Sign Up</button>
</template>