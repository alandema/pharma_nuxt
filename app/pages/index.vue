<script setup lang="ts">

// const data_hello = await useFetch('/api/hello')

function navigate (path: string) {
  return navigateTo({
    path: path,
  })
}
</script>

<template>
  <pre>ESTA É A ÁREA DE UM PRESCRITOR</pre>
  <button loading-auto @click="navigate('/patients')">Ir para Pacientes</button>
  <button loading-auto @click="navigate('/prescriptions')">Ir para Prescrições</button>
</template>