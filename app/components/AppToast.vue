<template>
  <div style="position:fixed;bottom:1rem;right:1rem;display:flex;flex-direction:column;gap:.5rem;z-index:9999">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :style="{
        padding: '.75rem 1rem',
        borderRadius: '6px',
        color: '#fff',
        background: toast.type === 'error' ? '#dc2626' : toast.type === 'warning' ? '#d97706' : '#16a34a',
        boxShadow: '0 2px 8px rgba(0,0,0,.2)',
        maxWidth: '320px'
      }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { toasts } = useToast()
</script>
