<script setup lang="ts">
const f = ref({
  username: '', password: '', email: '', role: 'prescritor',
  full_name: '', cpf: '', gender: '', birth_date: '', phone: '',
  professional_type: '', council: '', council_number: '', council_state: '', specialties: [] as string[],
  zipcode: '', street: '', address_number: '', complement: '', city: '', state: ''
})
const { add: addToast } = useToast()

const { data: profs } = await useAsyncData('profs', () => queryCollection('professionals').first())
const { data: genders } = await useAsyncData('genders', () => queryCollection('genders').first())

const states = ref<any[]>([])
const cities = ref<any[]>([])

const selectedProf = computed(() => profs.value?.professionals?.find((p: any) => p.name === f.value.professional_type))

watch(() => f.value.professional_type, () => {
  f.value.council = selectedProf.value?.council || ''
  f.value.specialties = []
})

onMounted(async () => {
  states.value = await $fetch<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
})

watch(() => f.value.state, async (uf) => {
  f.value.city = ''
  cities.value = uf ? await $fetch<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`) : []
})

const submit = async () => {
  try {
    await $fetch('/api/users/admin', { method: 'POST', body: f.value })
    addToast('Usuário criado com sucesso!', 'success')
    navigateTo('/admin/users')
  } catch (error: any) {
    addToast(error.data?.message || 'Erro', 'error')
  }
}
</script>

<template>
  <div class="page-header">
    <h1>Novo Usuário</h1>
    <button @click="navigateTo('/admin/users')">← Voltar</button>
  </div>
  <div class="card">
    <form @submit.prevent="submit" class="grid-form">
      <div class="form-group"><label>Usuário *</label><input v-model="f.username" required /></div>
      <div class="form-group"><label>Senha *</label><input v-model="f.password" type="password" required /></div>
      <div class="form-group"><label>Função *</label>
        <select v-model="f.role" required><option value="prescritor">Prescritor</option><option value="admin">Admin</option></select>
      </div>
      <div class="form-group"><label>Email *</label><input v-model="f.email" type="email" required /></div>
      
      <div class="form-group"><label>Nome Completo</label><input v-model="f.full_name" /></div>
      <div class="form-group"><label>CPF</label><input v-model="f.cpf" /></div>
      <div class="form-group"><label>Gênero</label>
        <select v-model="f.gender"><option v-for="g in genders?.genders" :key="g.id" :value="g.name">{{ g.name }}</option></select>
      </div>
      <div class="form-group"><label>Nascimento</label><input v-model="f.birth_date" type="date" /></div>
      <div class="form-group"><label>Telefone</label><input v-model="f.phone" placeholder="+55(00)00000-0000" /></div>

      <div class="form-group"><label>Tipo de Profissional</label>
        <select v-model="f.professional_type">
          <option v-for="p in profs?.professionals" :key="p.id" :value="p.name">{{ p.name }}</option>
        </select>
      </div>
      <div class="form-group"><label>Conselho</label><input v-model="f.council" disabled /></div>
      <div class="form-group"><label>Número do Conselho</label><input v-model="f.council_number" /></div>
      <div class="form-group"><label>UF Conselho</label>
        <select v-model="f.council_state">
          <option v-for="s in states" :key="s.id" :value="s.sigla">{{ s.sigla }}</option>
        </select>
      </div>
      
      <div class="form-group" style="grid-column: 1 / -1" v-if="selectedProf">
        <label>Especialidades</label>
        <div style="display:flex;gap:1rem;flex-wrap:wrap">
          <label v-for="spec in selectedProf.specialties" :key="spec" style="display:flex;align-items:center;gap:0.5rem">
            <input type="checkbox" :value="spec" v-model="f.specialties" /> {{ spec }}
          </label>
        </div>
      </div>

      <div class="form-group"><label>CEP</label><input v-model="f.zipcode" /></div>
      <div class="form-group"><label>Estado</label>
        <select v-model="f.state">
          <option v-for="s in states" :key="s.id" :value="s.sigla">{{ s.nome }}</option>
        </select>
      </div>
      <div class="form-group"><label>Cidade</label>
        <select v-model="f.city" :disabled="!cities.length">
          <option v-for="c in cities" :key="c.id" :value="c.nome">{{ c.nome }}</option>
        </select>
      </div>
      <div class="form-group" style="grid-column: 1 / -1"><label>Endereço</label><input v-model="f.street" /></div>
      <div class="form-group"><label>Número</label><input v-model="f.address_number" /></div>
      <div class="form-group"><label>Complemento</label><input v-model="f.complement" /></div>

      <div class="form-group" style="grid-column: 1 / -1">
        <button type="submit">Criar Usuário</button>
      </div>
    </form>
  </div>
</template>
<style scoped>
.grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.card { padding: 1.5rem; }
</style>