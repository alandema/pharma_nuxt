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
  <h1>Prescription List</h1>
  
  <div>
    <label>Filter by Patient:</label>
    <select v-model="selectedPatientId" @change="filterByPatient">
      <option value="">All Patients</option>
      <option v-for="patient in patients" :key="patient.id" :value="patient.id">
        {{ patient.name }}
      </option>
    </select>
    <button v-if="selectedPatientId" @click="clearFilter">Clear Filter</button>
  </div>

  <ul v-if="response?.prescriptions?.length">
    <li v-for="prescription in response.prescriptions" :key="prescription.id">
      <NuxtLink :to="`/prescriptions/${prescription.id}`">
        {{ prescription.date_prescribed }} - {{ prescription.patient.name }}
        <span v-if="prescription.user"> (by {{ prescription.user.username }})</span>
      </NuxtLink>
    </li>
  </ul>
  <p v-else>No prescriptions found.</p>

  <div v-if="response && response.totalPages > 1">
    <button @click="goToPage(page - 1)" :disabled="page <= 1">Previous</button>
    <span>Page {{ page }} of {{ response.totalPages }}</span>
    <button @click="goToPage(page + 1)" :disabled="page >= response.totalPages">Next</button>
  </div>

  <div>
    <button @click="navigateTo('/prescriptions/register')">Create New Prescription</button>
  </div>
</template>