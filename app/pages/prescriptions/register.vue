<script setup lang="ts">

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const patient_id = ref('');
const date_prescribed = ref(getTodayDate());
const json_form_info = ref('');

const { data: patients } = await useFetch('/api/patients', {
  method: 'GET',
});

const submit = async () => {
  await $fetch('/api/prescriptions', {
    method: 'POST',
    body: {
      patient_id: patient_id.value,
      date_prescribed: date_prescribed.value,
      json_form_info: json_form_info.value,
    }
  });
  await navigateTo('/prescriptions');
};

</script>

<template>
  <h1>Create New Prescription</h1>
  <form @submit.prevent="submit">
    <div>
      <label>Patient:</label>
      <select v-model="patient_id" required>
        <option value="" disabled>Select a patient</option>
        <option v-for="patient in patients" :key="patient.id" :value="patient.id">
          {{ patient.name }}
        </option>
      </select>
    </div>
    
    <div>
      <label>Date Prescribed:</label>
      <input v-model="date_prescribed" type="date" required />
    </div>
    
    <div>
      <label>Prescription Details:</label>
      <textarea v-model="json_form_info" placeholder="Enter prescription details" rows="10" required></textarea>
    </div>
    
    <button type="submit">Save Prescription</button>
  </form>
  <div>
    <button @click="navigateTo('/prescriptions')">Back to Prescription List</button>
  </div>
</template>