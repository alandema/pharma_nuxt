<script setup lang="ts">

const data_hello = await useFetch('/api/hello')

</script>

<template>
  <pre>THIS IS ADMIN {{ data_hello.data }}</pre>
  <button loading-auto @click="navigateTo('/admin/patients')">Go Patients</button>
  <button loading-auto @click="navigateTo('/admin/formulas')">Go Formulas</button>
  <button loading-auto @click="navigateTo('/admin/users')">Go Users</button>
</template>