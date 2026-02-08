<script setup lang="ts">
definePageMeta({
  middleware: ['user-pages-middleware'],
})
const data_hello = await useFetch('/api/hello')
</script>

<template>
  <pre>THIS IS INDEX {{ data_hello.data }}</pre>
</template>