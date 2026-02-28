<script setup lang="ts">
const { data: patients } = await useFetch('/api/patients', { method: 'GET' })
const { data: me } = await useFetch('/api/users/me')
const isAdmin = computed(() => (me.value as any)?.role === 'admin')
</script>

<template>
  <div class="page-header">
    <h1>👥 Pacientes</h1>
    <button class="btn-primary" @click="navigateTo('/patients/register')">+ Novo Paciente</button>
  </div>
  <div class="card">
    <template v-if="patients?.length">
      <table class="list-table">
        <thead>
          <tr><th>Paciente</th></tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.id">
            <td>
              <NuxtLink :to="`/patients/${patient.id}`">
                {{ patient.name }} <span class="text-muted">{{ patient.cpf }}</span>
                <span v-if="isAdmin" class="text-muted"> — {{ patient.user?.username }}</span>
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <div v-else class="empty">Nenhum paciente cadastrado.</div>
  </div>
</template>