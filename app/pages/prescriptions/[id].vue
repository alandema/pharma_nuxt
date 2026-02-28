<script setup lang="ts">

type Patient = {
  id: string;
  name: string;
  cpf?: string | null;
  rg?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  phone?: string | null;
  street?: string | null;
  district?: string | null;
  house_number?: string | null;
  city?: string | null;
  state?: string | null;
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

const { data: prescription } = await useFetch<Prescription>(
  `/api/prescriptions/${route.params.id}`,
  { method: 'GET' }
);

const openPrintPage = () => {
  window.open(`/prescriptions/print/${route.params.id}`, '_blank');
};

</script>

<template>
  <div class="page-header">
    <h1>Detalhes da Prescrição</h1>
    <div class="btn-group">
      <button @click="navigateTo('/prescriptions')">← Voltar</button>
      <button class="btn-primary" @click="openPrintPage">🖨️ Imprimir</button>
    </div>
  </div>

  <div v-if="prescription">
    <div class="card mb-2">
      <h2>Informações</h2>
      <div class="form-row">
        <div><label>Data</label><p>{{ prescription.date_prescribed }}</p></div>
        <div><label>Prescrito por</label><p>{{ prescription.user?.username || 'Desconhecido' }}</p></div>
      </div>
      <div><label>Criado em</label><p>{{ new Date(prescription.created_at).toLocaleString('pt-BR') }}</p></div>
    </div>

    <div class="card mb-2">
      <h2>Paciente</h2>
      <p><strong>{{ prescription.patient.name }}</strong></p>
      <p v-if="prescription.patient.cpf" class="text-muted">CPF: {{ prescription.patient.cpf }}</p>
      <p v-if="prescription.patient.phone" class="text-muted">Tel: {{ prescription.patient.phone }}</p>
      <p v-if="prescription.patient.birth_date" class="text-muted">Nasc: {{ prescription.patient.birth_date }}</p>
    </div>

    <div class="card">
      <h2>Conteúdo da Prescrição</h2>
      <pre style="white-space:pre-wrap;font-size:.85rem;background:var(--c-bg);padding:1rem;border-radius:var(--radius)">{{ prescription.json_form_info }}</pre>
    </div>
  </div>
  <div v-else class="card empty">Prescrição não encontrada.</div>
</template>