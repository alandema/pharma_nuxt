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
    <h1>Detalhes do Usuário</h1>
    <div v-if="user">
        <p>Usuário: {{ user.username }}</p>
        <p>Função: {{ user.role }}</p>
        <p>Status: {{ user.is_active ? 'Ativo' : 'Inativo' }}</p>
        <button @click="toggleActive">{{ user.is_active ? 'Desativar' : 'Ativar' }}</button>
        <button @click="deleteUser" style="margin-left:8px;color:red">Excluir Usuário</button>
    </div>
    <button @click="navigateTo('/admin/users')">Voltar para a Lista de Usuários</button>
</template>