<script setup lang="ts">

type Patient = {
  id: string;
  name: string;
  cpf?: string;
  phone?: string;
  birth_date?: string;
};

type User = {
  id: string;
  username: string;
};

type Prescription = {
  id: string;
  patient_id: string;
  prescribed_by: string | null;
  date_prescribed: string;
  json_form_info: string;
  created_at: string;
  patient: Patient;
  user: User | null;
};

const route = useRoute();
const { data: prescription } = await useFetch<Prescription>(`/api/prescriptions/${route.params.id}`, {
  method: 'GET'
});

</script>

<template>
  <h1>Prescription Details</h1>

  <div v-if="prescription">
    <h2>Prescription Information</h2>
    <ul>
      <li><strong>Date Prescribed:</strong> {{ prescription.date_prescribed }}</li>
      <li><strong>Prescribed By:</strong> {{ prescription.user?.username || 'Unknown' }}</li>
      <li><strong>Created At:</strong> {{ new Date(prescription.created_at).toLocaleString() }}</li>
    </ul>

    <h2>Patient Information</h2>
    <ul>
      <li><strong>Name:</strong> {{ prescription.patient.name }}</li>
      <li v-if="prescription.patient.cpf"><strong>CPF:</strong> {{ prescription.patient.cpf }}</li>
      <li v-if="prescription.patient.phone"><strong>Phone:</strong> {{ prescription.patient.phone }}</li>
      <li v-if="prescription.patient.birth_date"><strong>Birth Date:</strong> {{ prescription.patient.birth_date }}</li>
    </ul>

    <h2>Prescription Details</h2>
    <pre>{{ prescription.json_form_info }}</pre>
  </div>
  <p v-else>Prescription not found.</p>

  <button @click="navigateTo('/prescriptions')">Back to Prescriptions</button>
</template>