<script setup lang="ts">
function navigate(path: string) { return navigateTo({ path }) }
</script>

<template>
  <h1>Área do Prescritor</h1>
  <div class="dash-grid">
    <div class="dash-card" @click="navigate('/patients')">
      <div class="dash-icon">👥</div>
      <div class="dash-label">Pacientes</div>
    </div>
    <div class="dash-card" @click="navigate('/prescriptions')">
      <div class="dash-icon">📋</div>
      <div class="dash-label">Prescrições</div>
    </div>
  </div>
</template>