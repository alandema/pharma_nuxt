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

const name = ref(patient.value?.name || '')
const rg = ref(patient.value?.rg || '')
const gender = ref(patient.value?.gender || '')
const cpf = ref(patient.value?.cpf || '')
const birth_date = ref(patient.value?.birth_date || '')
const phone = ref(patient.value?.phone || '')
const zipcode = ref(patient.value?.zipcode || '')
const street = ref(patient.value?.street || '')
const district = ref(patient.value?.district || '')
const house_number = ref(patient.value?.house_number || '')
const additional_info = ref(patient.value?.additional_info || '')
const country = ref(patient.value?.country || '')
const state = ref(patient.value?.state || '')
const city = ref(patient.value?.city || '')
const medical_history = ref(patient.value?.medical_history || '')

const save = async () => {
  await $fetch(`/api/patients/${route.params.id}`, {
    method: 'PUT',
    body: {
      name: name.value,
      rg: rg.value,
      gender: gender.value,
      cpf: cpf.value,
      birth_date: birth_date.value,
      phone: phone.value,
      zipcode: zipcode.value,
      street: street.value,
      district: district.value,
      house_number: house_number.value,
      additional_info: additional_info.value,
      country: country.value,
      state: state.value,
      city: city.value,
      medical_history: medical_history.value,
    }
  })
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
    <form @submit.prevent="save">
      <div class="form-group"><label>Nome *</label><input v-model="name" placeholder="Nome completo" required /></div>
      <div class="form-row">
        <div class="form-group"><label>CPF</label><input v-model="cpf" placeholder="000.000.000-00" /></div>
        <div class="form-group"><label>RG</label><input v-model="rg" placeholder="RG" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Gênero</label><input v-model="gender" placeholder="Gênero" /></div>
        <div class="form-group"><label>Data de Nascimento</label><input v-model="birth_date" type="date" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Telefone</label><input v-model="phone" placeholder="(00) 00000-0000" /></div>
        <div class="form-group"><label>CEP</label><input v-model="zipcode" placeholder="00000-000" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Rua</label><input v-model="street" placeholder="Rua" /></div>
        <div class="form-group"><label>Número</label><input v-model="house_number" placeholder="Nº" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Bairro</label><input v-model="district" placeholder="Bairro" /></div>
        <div class="form-group"><label>Complemento</label><input v-model="additional_info" placeholder="Apto, Bloco..." /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>País</label><input v-model="country" placeholder="País" /></div>
        <div class="form-group"><label>Estado</label><input v-model="state" placeholder="UF" /></div>
      </div>
      <div class="form-group"><label>Cidade</label><input v-model="city" placeholder="Cidade" /></div>
      <div class="form-group"><label>Histórico Médico</label><textarea v-model="medical_history" placeholder="Observações clínicas..." rows="4"></textarea></div>
      <button type="submit">Salvar Alterações</button>
    </form>
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