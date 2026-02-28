<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
</script>

<template>
  <div class="auth-page">
    <div class="card auth-card">
      <div style="font-size:3rem;margin-bottom:.5rem">⚠️</div>
      <h1>Erro {{ error.statusCode }}</h1>
      <p class="text-muted" style="margin-bottom:1.5rem">{{ error.message || 'Algo deu errado.' }}</p>
      <button class="btn-primary" @click="clearError({ redirect: '/' })">Voltar ao início</button>
    </div>
  </div>
</template>
