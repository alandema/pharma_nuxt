<script setup lang="ts">
import { useInputFormatting } from '../composables/useInputFormatting'

const props = defineProps<{ initial?: Record<string, any>, submitLabel?: string }>()
const emit = defineEmits<{ submit: [data: Record<string, any>] }>()
const { formatBrazilPhoneInput, formatCepInput, isBrazilCountry, normalizeText, isValidBirthDate } = useInputFormatting()

const f = reactive({
  name: '', rg: '', gender: '', cpf: '', birth_date: '', phone: '',
  email: '', send_email: true,
  zipcode: '', street: '', district: '', house_number: '',
  additional_info: '', country: '', state: '', city: '', medical_history: ''
})
if (props.initial) Object.assign(f, props.initial)

const { data: gendersData } = await useAsyncData('genders', () => queryCollection('genders').first())
const { data: countries } = await useFetch<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/paises')
const states = ref<any[]>([])
const cities = ref<any[]>([])

// Pre-load states/cities for existing data (edit mode)
if (isBrazilCountry(f.country)) states.value = await $fetch<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
if (f.state) cities.value = await $fetch<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${f.state}/municipios`)

watch(() => f.country, async (name) => {
  f.state = ''
  f.city = ''
  cities.value = []
  if (!isBrazilCountry(name)) f.zipcode = ''
  states.value = isBrazilCountry(name) ? await $fetch<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados') : []
})
watch(() => f.state, async (uf) => { f.city = ''; cities.value = uf ? await $fetch<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`) : [] })

watch(() => f.phone, (value) => {
  const formatted = formatBrazilPhoneInput(value)
  if (formatted !== value) f.phone = formatted
}, { immediate: true })

watch(() => f.zipcode, (value) => {
  const formatted = formatCepInput(value)
  if (formatted !== value) f.zipcode = formatted
}, { immediate: true })

const submitForm = () => {
  if (f.birth_date && !isValidBirthDate(f.birth_date)) return

  const payload = {
    ...f,
    name: normalizeText(f.name, { titleCase: true }),
    email: normalizeText(f.email),
    rg: normalizeText(f.rg),
    gender: normalizeText(f.gender, { titleCase: true }),
    cpf: normalizeText(f.cpf),
    birth_date: normalizeText(f.birth_date),
    phone: formatBrazilPhoneInput(f.phone),
    zipcode: isBrazilCountry(f.country) ? formatCepInput(f.zipcode) : '',
    street: normalizeText(f.street, { titleCase: true }),
    district: normalizeText(f.district, { titleCase: true }),
    house_number: normalizeText(f.house_number),
    additional_info: normalizeText(f.additional_info, { titleCase: true }),
    country: normalizeText(f.country, { titleCase: true }),
    state: normalizeText(f.state).toUpperCase(),
    city: normalizeText(f.city, { titleCase: true }),
    medical_history: normalizeText(f.medical_history),
  }

  emit('submit', payload)
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="form-group"><label>Nome *</label><input v-model="f.name" placeholder="Nome completo" required /></div>
    <div class="form-row">
      <div class="form-group"><label>E-mail</label><input v-model="f.email" type="email" placeholder="paciente@email.com" /></div>
      <div class="form-group" style="display:flex;align-items:center;gap:0.5rem;margin-top:1.5rem"><input type="checkbox" id="pe" v-model="f.send_email" checked="false" /><label for="pe" style="margin:0">Receber e-mails</label></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>CPF</label><input v-model="f.cpf" placeholder="000.000.000-00" /></div>
      <div class="form-group"><label>RG</label><input v-model="f.rg" placeholder="RG" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Gênero</label><select v-model="f.gender"><option value="">Selecione</option><option v-for="g in gendersData?.genders" :key="g.id" :value="g.name">{{ g.name }}</option></select></div>
      <div class="form-group"><label>Data de Nascimento</label><input v-model="f.birth_date" type="date" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Telefone *</label><input required v-model="f.phone" inputmode="tel" placeholder="Ex: +55 11 91234-5678" /></div>
      <div class="form-group"><label>CEP</label><input v-model="f.zipcode" inputmode="numeric" placeholder="00000-000" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Rua</label><input v-model="f.street" placeholder="Rua" /></div>
      <div class="form-group"><label>Número</label><input v-model="f.house_number" placeholder="Nº" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Bairro</label><input v-model="f.district" placeholder="Bairro" /></div>
      <div class="form-group"><label>Complemento</label><input v-model="f.additional_info" placeholder="Apto, Bloco..." /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>País</label><select v-model="f.country"><option value="">Selecione</option><option v-for="c in countries" :key="c.id['M49']" :value="c.nome">{{ c.nome }}</option></select></div>
      <div class="form-group"><label>Estado</label><select v-model="f.state" :disabled="!states.length"><option value="">Selecione</option><option v-for="s in states" :key="s.id" :value="s.sigla">{{ s.nome }}</option></select></div>
    </div>
    <div class="form-group"><label>Cidade</label><select v-model="f.city" :disabled="!cities.length"><option value="">Selecione</option><option v-for="c in cities" :key="c.id" :value="c.nome">{{ c.nome }}</option></select></div>
    <div class="form-group"><label>Histórico Médico</label><textarea v-model="f.medical_history" placeholder="Observações clínicas..." rows="4"></textarea></div>
    <button type="submit">{{ submitLabel ?? 'Salvar' }}</button>
  </form>
</template>
