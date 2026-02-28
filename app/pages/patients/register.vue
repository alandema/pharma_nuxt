<script setup lang="ts">

const name = ref('')
const rg = ref('')
const gender = ref('')
const cpf = ref('')
const birth_date = ref('')
const phone = ref('')
const zipcode = ref('')
const street = ref('')
const district = ref('')
const house_number = ref('')
const additional_info = ref('')
const country = ref('')
const state = ref('')
const city = ref('')
const medical_history = ref('')

const { data: countries } = await useFetch<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/paises')
const states = ref<any[]>([])
const cities = ref<any[]>([])
watch(country, async (name) => { state.value = ''; city.value = ''; cities.value = []; states.value = name === 'Brasil' ? await $fetch<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados') : [] })
watch(state, async (uf) => { city.value = ''; cities.value = uf ? await $fetch<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`) : [] })

const submit = async () => {
  await $fetch('/api/patients', {
    method: 'POST',
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
  await navigateTo('/patients')
}

</script>

<template>
  <div class="page-header">
    <h1>Novo Paciente</h1>
    <button @click="navigateTo('/patients')"> ← Voltar</button>
  </div>
  <div class="card">
    <form @submit.prevent="submit">
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
        <div class="form-group"><label>País</label><select v-model="country"><option value="">Selecione</option><option v-for="c in countries" :key="c.id['M49']" :value="c.nome">{{ c.nome }}</option></select></div>
        <div class="form-group"><label>Estado</label><select v-model="state" :disabled="!states.length"><option value="">Selecione</option><option v-for="s in states" :key="s.id" :value="s.sigla">{{ s.nome }}</option></select></div>
      </div>
      <div class="form-group"><label>Cidade</label><select v-model="city" :disabled="!cities.length"><option value="">Selecione</option><option v-for="c in cities" :key="c.id" :value="c.nome">{{ c.nome }}</option></select></div>
      <div class="form-group"><label>Histórico Médico</label><textarea v-model="medical_history" placeholder="Observações clínicas..." rows="4"></textarea></div>
      <button type="submit">Salvar Paciente</button>
    </form>
  </div>
</template>