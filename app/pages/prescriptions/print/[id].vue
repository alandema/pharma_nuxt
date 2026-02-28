<script setup lang="ts">
type Patient = {
  id: string;
  name: string;
  cpf?: string | null;
  rg?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  phone?: string | null;
  street?: string | null;
  district?: string | null;
  house_number?: string | null;
  city?: string | null;
  state?: string | null;
};

type User = {
  id: string;
  username: string;
};

type Prescription = {
  id: string;
  patient_id: string;
  prescribed_by: string | null;
  date_prescribed: string;
  json_form_info: Record<string, unknown> | string;
  created_at: string;
  patient: Patient;
  user: User | null;
};

const route = useRoute();

const [{ data: prescription }, { data: cidsData }] = await Promise.all([
  useFetch<Prescription>(`/api/prescriptions/${route.params.id}`, { method: 'GET' }),
  useAsyncData('cids-print', () => queryCollection('cids').first()),
]);

const cids = computed(() => {
  const codes = cidsData.value?.codes ?? [];
  return [...codes].sort((a: { code: string; name: string }, b: { code: string; name: string }) =>
    a.name.localeCompare(b.name)
  );
});

// Hide the site header and footer on this page
onMounted(() => document.body.classList.add('print-page'));
onUnmounted(() => document.body.classList.remove('print-page'));
</script>

<template>
  <div>
    <div class="print-controls">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir / Salvar como PDF</button>
      <button class="btn" onclick="window.close()">Fechar</button>
    </div>

    <PrescriptionTemplate
      v-if="prescription"
      :prescription="prescription"
      :cids="cids"
    />
    <p v-else>Prescrição não encontrada.</p>
  </div>
</template>

<style scoped>
.print-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: var(--c-bg);
  border-bottom: 1px solid var(--c-border);
}

@media print {
  .print-controls { display: none; }
}
</style>
