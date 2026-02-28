<script setup lang="ts">

const getTodayDate = () => new Date().toISOString().split('T')[0];

const patient_id = ref('');
const date_prescribed = ref(getTodayDate());
const json_form_info = ref('');
const cid_code = ref('');

const [{ data: patients }, { data: cidsData }] = await Promise.all([
  useFetch('/api/patients'),
  useAsyncData('cids', () => queryCollection('cids').first())
]);

const cids = computed(() => {
  const codes = cidsData.value?.codes ?? [];
  return [...codes].sort((a, b) => a.name.localeCompare(b.name));
});

const submit = async () => {
  await $fetch('/api/prescriptions', {
    method: 'POST',
    body: { patient_id: patient_id.value, date_prescribed: date_prescribed.value, cid_code: cid_code.value, json_form_info: json_form_info.value }
  });
  await navigateTo('/prescriptions');
};

</script>

<template>
  <div class="page-header">
    <h1>Nova Prescrição</h1>
    <button @click="navigateTo('/prescriptions')">← Voltar</button>
  </div>
  <div class="card">
    <form @submit.prevent="submit">
      <div class="form-row">
        <div class="form-group">
          <label>Paciente *</label>
          <select v-model="patient_id" required>
            <option value="" disabled>Selecione um paciente</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patient.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Data *</label>
          <input v-model="date_prescribed" type="date" required />
        </div>
      </div>
      <div class="form-group">
        <label>Código CID *</label>
        <select v-model="cid_code" required>
          <option value="" disabled>Selecione um código CID</option>
          <option v-for="c in cids" :key="c.code" :value="c.code">{{ c.code }} – {{ c.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Detalhes da Prescrição *</label>
        <textarea v-model="json_form_info" placeholder="Insira os detalhes da prescrição" rows="10" required></textarea>
      </div>
      <button type="submit">Salvar Prescrição</button>
    </form>
  </div>
</template>