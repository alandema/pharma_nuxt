<script setup lang="ts">

const toast = useToast()

const submit = async (data: Record<string, string>) => {
  try {
    await $fetch('/api/patients', { method: 'POST', body: data })
    toast.add('Paciente registrado com sucesso!', 'success')
    await navigateTo('/patients')
  } catch (error: any) {
    toast.add(error.data?.message ?? 'Algo deu errado', 'error')
  }
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