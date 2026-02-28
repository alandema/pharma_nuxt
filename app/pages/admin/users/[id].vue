<script setup lang="ts">

type User = { id: string; username: string; role: string; is_active: boolean }

const route = useRoute()
const { data: user, refresh } = await useFetch<User>(`/api/users/admin/${route.params.id}`, { method: 'GET' })

async function toggleActive() {
  await $fetch(`/api/users/admin/${route.params.id}`, { method: 'PATCH' })
  await refresh()
}

async function deleteUser() {
  if (!confirm(`Excluir usuário "${user.value?.username}"? Seus pacientes serão transferidos para você.`)) return
  await $fetch(`/api/users/admin/${route.params.id}`, { method: 'DELETE' })
  navigateTo('/admin/users')
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
    <div class="btn-group">
      <button @click="toggleActive">{{ user.is_active ? 'Desativar' : 'Ativar' }}</button>
      <button class="btn-danger" @click="deleteUser">Excluir Usuário</button>
    </div>
  </div>
</template>