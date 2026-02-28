<script setup lang="ts">

type Patient = {
  id: string;
  name: string;
  registered_by: string;
  registered_by_username?: string | null;
  rg?: string;
  gender?: string;
  cpf?: string;
  birth_date?: string;
  phone?: string;
  zipcode?: string;
  street?: string;
  district?: string;
  house_number?: string;
  additional_info?: string;
  country?: string;
  state?: string;
  city?: string;
  medical_history?: string;
  prescriptions: Prescription[];
}

type Prescription = {
  id: string;
  patient_id: string;
  date_prescribed: string;
  json_form_info: string;
  created_at: string;
}

type Doctor = { id: string; username: string; role: string }

const route = useRoute()
const { data: patient, refresh } = await useFetch<Patient>(`/api/patients/${route.params.id}`, { method: 'GET' })
const { data: me } = await useFetch('/api/users/me')
const isAdmin = computed(() => (me.value as any)?.role === 'admin')
const canDelete = computed(() => isAdmin.value || (me.value as any)?.userId === patient.value?.registered_by)

const { data: allUsers } = await useFetch<Doctor[]>('/api/users/admin', { method: 'GET' })
const doctors = computed(() => allUsers.value?.filter(u => u.role === 'doctor') ?? [])
const selectedDoctorId = ref('')
const transferError = ref('')
const transferSuccess = ref('')
const transferPatient = async () => {
  transferError.value = ''
  transferSuccess.value = ''
  if (!selectedDoctorId.value) { transferError.value = 'Por favor, selecione um médico.'; return }
  try {
    const result = await $fetch(`/api/patients/${route.params.id}/transfer`, {
      method: 'POST',
      body: { doctor_id: selectedDoctorId.value },
    })
    await refresh()
    transferSuccess.value = `Paciente transferido com sucesso para ${result.transferred_to}.`
    selectedDoctorId.value = ''
  } catch (err: any) {
    transferError.value = err?.data?.statusMessage ?? 'Falha na transferência.'
  }
}

const deletePatient = async () => {
  if (!confirm('Excluir este paciente?')) return
  await $fetch(`/api/patients/${route.params.id}`, { method: 'DELETE' })
  await navigateTo('/patients')
}

const initialData = computed(() => {
  const p = patient.value
  return p ? { name: p.name, rg: p.rg || '', gender: p.gender || '', cpf: p.cpf || '', birth_date: p.birth_date || '', phone: p.phone || '', zipcode: p.zipcode || '', street: p.street || '', district: p.district || '', house_number: p.house_number || '', additional_info: p.additional_info || '', country: p.country || '', state: p.state || '', city: p.city || '', medical_history: p.medical_history || '' } : undefined
})

const save = async (data: Record<string, string>) => {
  await $fetch(`/api/patients/${route.params.id}`, { method: 'PUT', body: data })
  refresh()
  await navigateTo('/patients')
}
</script>

<template>
  <div class="page-header">
    <h1>Detalhes do Paciente</h1>
    <div class="btn-group">
      <button @click="navigateTo('/patients')">← Voltar</button>
      <button v-if="canDelete" class="btn-danger" @click="deletePatient">Excluir</button>
    </div>
  </div>

  <div class="card mb-2">
    <PatientForm :initial="initialData" submit-label="Salvar Alterações" @submit="save" />
  </div>

  <div class="card mb-2">
    <h2>Prescrições</h2>
    <template v-if="patient?.prescriptions?.length">
      <div class="list-item" v-for="prescription in patient.prescriptions" :key="prescription.id">
        <NuxtLink :to="`/prescriptions/${prescription.id}`">
          <strong>{{ prescription.date_prescribed }}</strong>
          <span class="text-muted" style="margin-left:.5rem">{{ prescription.json_form_info.substring(0, 60) }}...</span>
        </NuxtLink>
      </div>
    </template>
    <div v-else class="empty">Nenhuma prescrição encontrada.</div>
  </div>

  <div v-if="isAdmin" class="card">
    <h2>Transferir Paciente</h2>
    <p class="text-muted mb-2">Médico atual: <strong>{{ patient?.registered_by_username ?? patient?.registered_by }}</strong></p>
    <div class="gap-row">
      <select v-model="selectedDoctorId" style="flex:1">
        <option value="" disabled>Selecione um médico</option>
        <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id" :disabled="doctor.id === patient?.registered_by">
          {{ doctor.username }}{{ doctor.id === patient?.registered_by ? ' (atual)' : '' }}
        </option>
      </select>
      <button class="btn-primary" @click="transferPatient" :disabled="!selectedDoctorId">Transferir</button>
    </div>
    <p v-if="transferSuccess" style="color:var(--c-success);margin-top:.5rem">{{ transferSuccess }}</p>
    <p v-if="transferError" style="color:var(--c-danger);margin-top:.5rem">{{ transferError }}</p>
  </div>
</template>