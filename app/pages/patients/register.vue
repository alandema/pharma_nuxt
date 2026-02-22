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
  <form @submit.prevent="submit">
    <input v-model="name" placeholder="Nome" required />
    <input v-model="rg" placeholder="RG" />
    <input v-model="gender" placeholder="Gênero" />
    <input v-model="cpf" placeholder="CPF" />
    <input v-model="birth_date" placeholder="Data de Nascimento" />
    <input v-model="phone" placeholder="Telefone" />
    <input v-model="zipcode" placeholder="CEP" />
    <input v-model="street" placeholder="Rua" />
    <input v-model="district" placeholder="Bairro" />
    <input v-model="house_number" placeholder="Número" />
    <input v-model="additional_info" placeholder="Complemento" />
    <select v-model="country"><option value="">País</option><option v-for="c in countries" :key="c.id['M49']" :value="c.nome">{{ c.nome }}</option></select>
    <select v-model="state" :disabled="!states.length"><option value="">Estado</option><option v-for="s in states" :key="s.id" :value="s.sigla">{{ s.nome }}</option></select>
    <select v-model="city" :disabled="!cities.length"><option value="">Cidade</option><option v-for="c in cities" :key="c.id" :value="c.nome">{{ c.nome }}</option></select>
    <textarea v-model="medical_history" placeholder="Histórico Médico"></textarea>
    <button type="submit">Salvar</button>
  </form>
  <div>
    <button @click="navigateTo('/patients')">Voltar para a Lista de Pacientes</button>
  </div>
</template>