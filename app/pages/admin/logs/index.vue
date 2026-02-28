<script setup lang="ts">
const page = ref(1)
const selectedUserId = ref('')
const selectedPatientId = ref('')
const selectedDate = ref('')

const { data: users } = await useFetch('/api/users/admin', { method: 'GET' })
const { data: patients } = await useFetch('/api/patients', { method: 'GET' })

const { data: response, refresh } = await useFetch<any>('/api/logs', {
  method: 'GET',
  query: { page, userId: selectedUserId, patientId: selectedPatientId, date: selectedDate },
  watch: [page, selectedUserId, selectedPatientId, selectedDate],
})

const clearFilters = () => {
  selectedUserId.value = ''
  selectedPatientId.value = ''
  selectedDate.value = ''
  page.value = 1
}

const goToPage = (n: number) => { page.value = n }
</script>

<template>
  <div class="page-header">
    <h1>📝 Logs</h1>
  </div>

  <div class="filter-bar">
    <label>Usuário:</label>
    <select v-model="selectedUserId" @change="page = 1">
      <option value="">Todos</option>
      <option v-for="u in users" :key="u.id" :value="u.id">{{ u.username }}</option>
    </select>
    <label>Paciente:</label>
    <select v-model="selectedPatientId" @change="page = 1">
      <option value="">Todos</option>
      <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
    </select>
    <label>Data:</label>
    <input type="date" v-model="selectedDate" @change="page = 1" />
    <button v-if="selectedUserId || selectedPatientId || selectedDate" class="btn-sm" @click="clearFilters">✕ Limpar</button>
  </div>

  <div class="card">
    <template v-if="response?.logs?.length">
      <table class="list-table">
        <thead>
          <tr><th>Data/Hora</th><th>Mensagem</th><th>Usuário</th><th>Paciente</th></tr>
        </thead>
        <tbody>
          <tr v-for="log in response.logs" :key="log.id">
            <td><span class="text-muted">{{ new Date(log.event_time).toLocaleString('pt-BR') }}</span></td>
            <td>{{ log.message }}</td>
            <td><span class="text-muted">{{ log.user?.username || '—' }}</span></td>
            <td><span class="text-muted">{{ log.patient?.name || '—' }}</span></td>
          </tr>
        </tbody>
      </table>
    </template>
    <div v-else class="empty">Nenhum log encontrado.</div>
  </div>

  <div v-if="response && response.totalPages > 1" class="pagination">
    <button class="btn-sm" @click="goToPage(page - 1)" :disabled="page <= 1">← Anterior</button>
    <span class="text-muted">Página {{ page }} de {{ response.totalPages }}</span>
    <button class="btn-sm" @click="goToPage(page + 1)" :disabled="page >= response.totalPages">Próxima →</button>
  </div>
</template>