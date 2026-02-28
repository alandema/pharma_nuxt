<script setup lang="ts">
</script>

<template>
  <h1>Área do Administrador</h1>
  <hr class="gold-divider" />
  <div class="dash-grid">
    <div class="dash-card" @click="navigateTo('/patients')">
      <div class="dash-icon">👥</div>
      <div class="dash-label">Pacientes</div>
    </div>
    <div class="dash-card" @click="navigateTo('/prescriptions')">
      <div class="dash-icon">📋</div>
      <div class="dash-label">Prescrições</div>
    </div>
    <div class="dash-card" @click="navigateTo('/admin/formulas')">
      <div class="dash-icon">🧪</div>
      <div class="dash-label">Fórmulas</div>
    </div>
    <div class="dash-card" @click="navigateTo('/admin/users')">
      <div class="dash-icon">👤</div>
      <div class="dash-label">Usuários</div>
    </div>
  </div>
</template>