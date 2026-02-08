<script setup lang="ts">
definePageMeta({
  middleware: [
    'admin-pages-middleware',
  ],
})
const data_hello = await useFetch('/api/hello')
</script>

<template>
  <pre>THIS IS ADMIN {{ data_hello.data }}</pre>
</template>