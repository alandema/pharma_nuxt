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
  <h1>Detalhes da Prescrição</h1>

  <div v-if="prescription">
    <h2>Informações da Prescrição</h2>
    <ul>
      <li><strong>Data da Prescrição:</strong> {{ prescription.date_prescribed }}</li>
      <li><strong>Prescrito Por:</strong> {{ prescription.user?.username || 'Desconhecido' }}</li>
      <li><strong>Criado Em:</strong> {{ new Date(prescription.created_at).toLocaleString() }}</li>
    </ul>

    <h2>Informações do Paciente</h2>
    <ul>
      <li><strong>Nome:</strong> {{ prescription.patient.name }}</li>
      <li v-if="prescription.patient.cpf"><strong>CPF:</strong> {{ prescription.patient.cpf }}</li>
      <li v-if="prescription.patient.phone"><strong>Telefone:</strong> {{ prescription.patient.phone }}</li>
      <li v-if="prescription.patient.birth_date"><strong>Data de Nascimento:</strong> {{ prescription.patient.birth_date }}</li>
    </ul>

    <h2>Detalhes da Prescrição</h2>
    <pre>{{ prescription.json_form_info }}</pre>

    <button @click="openPrintPage">Abrir Prescrição</button>
  </div>
  <p v-else>Prescrição não encontrada.</p>

  <button @click="navigateTo('/prescriptions')">Voltar para Prescrições</button>
</template>