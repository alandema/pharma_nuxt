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
      <table class="list-table">
        <thead>
          <tr><th>Fórmula</th></tr>
        </thead>
        <tbody>
          <tr v-for="formula in formulas" :key="formula.id" @click="navigateTo(`/admin/formulas/${formula.id}`)">
            <td>{{ formula.name }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <div v-else class="empty">Nenhuma fórmula cadastrada.</div>
  </div>
</template>