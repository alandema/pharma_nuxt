<script setup lang="ts">

const {data: formulas}  = await useFetch('/api/formulas',
    {
        method: 'GET',
    }
)

</script>

<template>
    <h1>Lista de Fórmulas</h1>
    <ul v-if="formulas">
        <li v-for="formula in formulas" :key="formula.id">
        <NuxtLink :to="`/admin/formulas/${formula.id}`">{{ formula.name }}</NuxtLink>
        </li>
    </ul>
    <div>
        <button @click="navigateTo('/admin/formulas/register')">Criar Nova Fórmula</button>
    </div>
</template>