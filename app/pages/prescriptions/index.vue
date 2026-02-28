<script setup lang="ts">

type Prescription = {
  id: string;
  patient_id: string;
  prescribed_by: string | null;
  date_prescribed: string;
  json_form_info: string;
  created_at: string;
  patient: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    username: string;
  } | null;
};

type PrescriptionResponse = {
  prescriptions: Prescription[];
  total: number;
  page: number;
  totalPages: number;
};

const page = ref(1);
const selectedPatientId = ref('');

const { data: patients } = await useFetch('/api/patients', {
  method: 'GET',
});

const { data: response, refresh } = await useFetch<PrescriptionResponse>('/api/prescriptions', {
  method: 'GET',
  query: {
    page,
    patientId: selectedPatientId
  },
  watch: [page, selectedPatientId]
});

const goToPage = (newPage: number) => {
  page.value = newPage;
};

const filterByPatient = () => {
  page.value = 1;
  refresh();
};

const clearFilter = () => {
  selectedPatientId.value = '';
  page.value = 1;
};

</script>

<template>
  <div class="page-header">
    <h1>📋 Prescrições</h1>
    <button class="btn-primary" @click="navigateTo('/prescriptions/register')">+ Nova Prescrição</button>
  </div>

  <div class="filter-bar">
    <label>Paciente:</label>
    <select v-model="selectedPatientId" @change="filterByPatient">
      <option value="">Todos</option>
      <option v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patient.name }}</option>
    </select>
    <button v-if="selectedPatientId" class="btn-sm" @click="clearFilter">✕ Limpar</button>
  </div>

  <div class="card">
    <template v-if="response?.prescriptions?.length">
      <table class="list-table">
        <thead>
          <tr><th>Data</th><th>Paciente</th><th>Médico</th></tr>
        </thead>
        <tbody>
          <tr v-for="prescription in response.prescriptions" :key="prescription.id">
            <td><NuxtLink :to="`/prescriptions/${prescription.id}`">{{ prescription.date_prescribed }}</NuxtLink></td>
            <td>{{ prescription.patient.name }}</td>
            <td><span v-if="prescription.user" class="text-muted">{{ prescription.user.username }}</span><span v-else class="text-muted">—</span></td>
          </tr>
        </tbody>
      </table>
    </template>
    <div v-else class="empty">Nenhuma prescrição encontrada.</div>
  </div>

  <div v-if="response && response.totalPages > 1" class="pagination">
    <button class="btn-sm" @click="goToPage(page - 1)" :disabled="page <= 1">← Anterior</button>
    <span class="text-muted">Página {{ page }} de {{ response.totalPages }}</span>
    <button class="btn-sm" @click="goToPage(page + 1)" :disabled="page >= response.totalPages">Próxima →</button>
  </div>
</template>