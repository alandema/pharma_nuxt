<script setup lang="ts">
import { useDateFormatting } from "../../composables/useDateFormatting";
import { useCurrentUser } from "../../composables/useCurrentUser";

type Prescription = {
  id: string;
  patient_id: string;
  prescribed_by: string | null;
  date_prescribed: string;
  created_at: string;
  patient: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
    full_name: string;
  } | null;
};

type PaginatedPrescriptionResponse = {
  data: Prescription[];
  metadata: PaginationMetadata;
};

type Patient = {
  id: string;
  name: string;
};

type PaginationMetadata = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const route = useRoute();
const page = ref(1);
const pageJumpInput = ref("1");
const { formatDatePtBR } = useDateFormatting();
const selectedPatientId = ref((route.query.patientId as string) || "");
const startDate = ref("");
const endDate = ref("");
const patientSearch = ref("");
const patientOptions = ref<Patient[]>([]);
let patientSearchTimer: ReturnType<typeof setTimeout> | undefined;

const { currentUser } = useCurrentUser();
const isAdmin = computed(() => {
  const role = currentUser.value?.role;
  return role === "admin" || role === "superadmin";
});

const searchPatients = async () => {
  patientOptions.value = await $fetch<Patient[]>("/api/patients/options", {
    query: { q: patientSearch.value, limit: 20 },
  });
};

const schedulePatientSearch = () => {
  selectedPatientId.value = "";
  if (patientSearchTimer) {
    clearTimeout(patientSearchTimer);
  }
  patientSearchTimer = setTimeout(searchPatients, 250);
};

const selectPatient = () => {
  const selectedPatient = patientOptions.value.find(
    (patient) => patient.name === patientSearch.value,
  );
  selectedPatientId.value = selectedPatient?.id || "";
  page.value = 1;
};

const { data: response } = await useFetch<PaginatedPrescriptionResponse>(
  "/api/prescriptions",
  {
    method: "GET",
    query: {
      page,
      limit: 10,
      patientId: selectedPatientId,
      startDate,
      endDate,
    },
    watch: [page, selectedPatientId, startDate, endDate],
  },
);

const prescriptions = computed(() => response.value?.data || []);
const metadata = computed(
  () => response.value?.metadata || { page: 1, totalPages: 1 },
);

const nextPage = () => {
  if (page.value < metadata.value.totalPages) {
    page.value++;
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};

const goToPage = () => {
  const parsedPage = Number.parseInt(pageJumpInput.value, 10);
  if (!Number.isFinite(parsedPage)) {
    pageJumpInput.value = String(metadata.value.page);
    return;
  }

  const totalPages = Math.max(1, metadata.value.totalPages);
  const targetPage = Math.min(totalPages, Math.max(1, parsedPage));

  page.value = targetPage;
  pageJumpInput.value = String(targetPage);
};

watch(
  () => metadata.value.page,
  (currentPage) => {
    pageJumpInput.value = String(currentPage);
  },
  { immediate: true },
);

const filterByPatient = () => {
  page.value = 1;
};

// test

const clearFilter = () => {
  patientSearch.value = "";
  selectedPatientId.value = "";
  startDate.value = "";
  endDate.value = "";
  page.value = 1;
};
</script>

<template>
  <div class="page-header">
    <h1>📋 Prescrições</h1>
    <button class="btn-primary" @click="navigateTo('/prescriptions/register')">
      + Nova Prescrição
    </button>
  </div>

  <div class="filter-bar">
    <div class="filter-group">
      <label>Paciente:</label>
      <input
        v-model="patientSearch"
        list="prescription-patient-options"
        placeholder="Digite o nome"
        @input="schedulePatientSearch"
        @change="selectPatient"
      />
      <datalist id="prescription-patient-options">
        <option
          v-for="patient in patientOptions"
          :key="patient.id"
          :value="patient.name"
        >
        </option>
      </datalist>
    </div>
    <div class="filter-group">
      <label>De:</label>
      <input v-model="startDate" type="date" @change="filterByPatient" />
    </div>
    <div class="filter-group">
      <label>Até:</label>
      <input v-model="endDate" type="date" @change="filterByPatient" />
    </div>
    <button
      v-if="selectedPatientId || startDate || endDate"
      class="btn-sm"
      @click="clearFilter"
    >
      ✕ Limpar
    </button>
  </div>

  <div class="card">
    <template v-if="prescriptions.length">
      <div class="table-responsive">
        <table class="list-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Paciente</th>
              <th v-if="isAdmin">Prescritor</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="prescription in prescriptions"
              :key="prescription.id"
              @click="navigateTo(`/prescriptions/${prescription.id}`,
                {
                  open: {target: '_blank'}
                }
              )"
            >
              <td data-label="Data">{{ formatDatePtBR(prescription.date_prescribed) }}</td>
              <td data-label="Paciente">{{ prescription.patient.name }}</td>
              <td v-if="isAdmin" data-label="Prescritor">
                <span class="text-muted">{{
                  prescription.user?.full_name || "—"
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button class="btn-secondary" :disabled="page <= 1" @click="prevPage">
          Anterior
        </button>
        <span class="pagination-info"
          >Página {{ metadata.page }} de {{ metadata.totalPages }}</span
        >
        <div class="pagination-jump">
          <label for="prescriptions-page-jump">Ir para</label>
          <input
            id="prescriptions-page-jump"
            v-model="pageJumpInput"
            type="number"
            inputmode="numeric"
            min="1"
            :max="Math.max(1, metadata.totalPages)"
            :disabled="metadata.totalPages <= 1"
            @keyup.enter.prevent="goToPage"
          />
        </div>
        <button
          class="btn-secondary"
          :disabled="page >= metadata.totalPages"
          @click="nextPage"
        >
          Próxima
        </button>
      </div>
    </template>
    <div v-else class="empty">Nenhuma prescrição encontrada.</div>
  </div>
</template>
