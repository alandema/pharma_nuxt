<script setup lang="ts">
const submit = async (data: Record<string, string>) => {
  await $fetch('/api/patients', { method: 'POST', body: data })
  await navigateTo('/patients')
}
</script>

<template>
  <div class="page-header">
    <h1>Novo Paciente</h1>
    <button @click="navigateTo('/patients')"> ← Voltar</button>
  </div>
  <div class="card">
    <PatientForm submit-label="Salvar Paciente" @submit="submit" />
  </div>
</template>