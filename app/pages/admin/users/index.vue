<script setup lang="ts">

const {data: users}  = await useFetch('/api/users/admin',
    {
        method: 'GET',
    }
)

</script>

<template>
  <div class="page-header">
    <h1>👤 Usuários</h1>
    <button class="btn-primary" @click="navigateTo('/admin/users/register')">+ Novo Usuário</button>
  </div>
  <div class="card">
    <template v-if="users?.length">
      <div class="list-item" v-for="user in users" :key="user.id">
        <NuxtLink :to="`/admin/users/${user.id}`">{{ user.username }}</NuxtLink>
        <span :class="['badge', user.role === 'admin' ? 'badge-admin' : 'badge-user']">{{ user.role }}</span>
      </div>
    </template>
    <div v-else class="empty">Nenhum usuário cadastrado.</div>
  </div>
</template>