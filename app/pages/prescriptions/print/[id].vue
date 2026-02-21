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
  json_form_info: string;
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
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button class="btn" onclick="window.close()">Close</button>
    </div>

    <PrescriptionTemplate
      v-if="prescription"
      :prescription="prescription"
      :cids="cids"
    />
    <p v-else>Prescription not found.</p>
  </div>
</template>

<style scoped>
/* Hide the app shell (header / footer from app.vue) on this page */
:global(body.print-page header),
:global(body.print-page footer) {
  display: none;
}

.print-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.btn {
  padding: 8px 24px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #555;
  background: #fff;
}

.btn-primary {
  background: #1a56a8;
  color: #fff;
  border-color: #1a56a8;
}

@media print {
  .print-controls {
    display: none;
  }
}
</style>
