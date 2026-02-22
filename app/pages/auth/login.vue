<script setup lang="ts">
const username = ref('')
const password = ref('')

const { add: addToast } = useToast()


const handleSubmit = async () => {
  try {
    const res = await $fetch<{ message: string }>('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })

    addToast(res.message, 'success')
    await refreshNuxtData()
    await navigateTo('/')

  } catch (err: any) {
    addToast(err.data?.message ?? 'Something went wrong', 'error')
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