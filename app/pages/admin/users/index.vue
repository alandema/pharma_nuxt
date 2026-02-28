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
      <table class="list-table">
        <thead>
          <tr><th>Usuário</th><th>Papel</th></tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td><NuxtLink :to="`/admin/users/${user.id}`">{{ user.username }}</NuxtLink></td>
            <td style="text-align:right"><span :class="['badge', user.role === 'admin' ? 'badge-admin' : 'badge-user']">{{ user.role }}</span></td>
          </tr>
        </tbody>
      </table>
    </template>
    <div v-else class="empty">Nenhum usuário cadastrado.</div>
  </div>
</template>