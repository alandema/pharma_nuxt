<script setup lang="ts">
const { data: patients } = await useFetch('/api/patients', { method: 'GET' })
const { data: me } = await useFetch('/api/users/me')
const isAdmin = computed(() => (me.value as any)?.role === 'admin')
</script>

<template>
    <h1>Lista de Pacientes</h1>
    <ul v-if="patients">
        <li v-for="patient in patients" :key="patient.id">
        <NuxtLink :to="`/patients/${patient.id}`">{{ patient.name }} - {{ patient.cpf }}<span v-if="isAdmin"> (Registrado por: {{ patient.user?.username }})</span></NuxtLink>
        </li>
    </ul>
    <button @click="navigateTo('/patients/register')">Criar Novo Paciente</button>
</template>