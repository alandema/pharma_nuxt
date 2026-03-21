<script setup lang="ts">

type User = { id: string; username: string; role: string; is_active: boolean; email?: string; send_email?: boolean }
type Me = { userId: string }  // Add this type definition

const toast = useToast()

const route = useRoute()
const { data: user, refresh } = await useFetch<User>(`/api/users/admin/${route.params.id}`, { method: 'GET' })

const email = ref(user.value?.email || '')
const sendEmail = ref(user.value?.send_email ?? true)

async function toggleActive() {
  await $fetch(`/api/users/admin/${route.params.id}`, { method: 'PATCH' })
  await refresh()
}

async function deleteUser() {
  if (!confirm(`Excluir usuário "${user.value?.username}"? Seus pacientes serão transferidos para você.`)) return
  await $fetch(`/api/users/admin/${route.params.id}`, { method: 'DELETE' })
  toast.add('Usuário excluído com sucesso. Seus pacientes foram transferidos para você.', 'success')
  navigateTo('/admin/users')
}

const { data: me } = await useFetch<Me>('/api/users/me')

async function saveSettings() {
  await $fetch(`/api/users/admin/${route.params.id}`, { 
    method: 'PATCH', 
    body: { 
      email: email.value, 
      send_email: sendEmail.value 
    } // ✅ Correto: Enviando os valores reais
  })

  toast.add("As configurações do usuário foram atualizadas com sucesso.", 'success')
  await refresh()
}

</script>

<template>
  <div class="page-header">
    <h1>Detalhes do Usuário</h1>
    <button @click="navigateTo('/admin/users')">← Voltar</button>
  </div>
  <div v-if="user" class="card">
    <div class="form-row mb-2">
      <div><label>Usuário</label><p style="font-size:1.1rem;font-weight:600">{{ user.username }}</p></div>
      <div><label>Função</label><p><span :class="['badge', user.role === 'admin' ? 'badge-admin' : 'badge-user']">{{ user.role }}</span></p></div>
    </div>
    <div class="mb-2">
      <label>Status</label>
      <p><span :class="['badge', user.is_active ? 'badge-active' : 'badge-inactive']">{{ user.is_active ? 'Ativo' : 'Inativo' }}</span></p>
    </div>

      <form @submit.prevent="saveSettings">
        <div class="form-group">
          <label>E-mail</label>
          <input required v-model="email" type="email" placeholder="usuario@email.com" />
        </div>
        <div class="form-group" style="display:flex;align-items:center;gap:0.5rem">
          <input type="checkbox" id="au_se" v-model="sendEmail" />
          <label for="au_se" style="margin:0">Permitir envios por e-mail</label>
        </div>
        <div class="btn-group" style="margin-top:1rem">
          <button type="submit">Salvar Alterações</button>
        </div>
      </form>

    <div v-if="me?.userId !== user.id" class="btn-group">
      <button @click="toggleActive">{{ user.is_active ? 'Desativar' : 'Ativar' }}</button>
      <button class="btn-danger" @click="deleteUser">Excluir Usuário</button>
    </div>
    <div v-else class="alert">Você não pode desativar ou excluir seu próprio usuário.</div>
  </div>
</template>