<script setup lang="ts">

const {data: formulas}  = await useFetch('/api/formulas',
    {
        method: 'GET',
    }
)

</script>

<template>
  <div class="page-header">
    <h1>🧪 Fórmulas</h1>
    <button class="btn-primary" @click="navigateTo('/admin/formulas/register')">+ Nova Fórmula</button>
  </div>
  <div class="card">
    <template v-if="formulas?.length">
      <div class="list-item" v-for="formula in formulas" :key="formula.id">
        <NuxtLink :to="`/admin/formulas/${formula.id}`">{{ formula.name }}</NuxtLink>
      </div>
    </template>
    <div v-else class="empty">Nenhuma fórmula cadastrada.</div>
  </div>
</template>