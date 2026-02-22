<script setup lang="ts">

// const data_hello = await useFetch('/api/hello')

</script>

<template>
  <pre>ESTA É A ÁREA DO ADMINISTRADOR</pre>
  <button loading-auto @click="navigateTo('/patients')">Ir para Pacientes</button>
  <button loading-auto @click="navigateTo('/prescriptions')">Ir para Prescrições</button>
  <button loading-auto @click="navigateTo('/admin/formulas')">Ir para Fórmulas</button>
  <button loading-auto @click="navigateTo('/admin/users')">Ir para Usuários</button>
</template>