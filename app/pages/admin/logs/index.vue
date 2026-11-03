<script setup lang="ts">
import { useDateFormatting } from "../../../composables/useDateFormatting";

type PaginationMetadata = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type PaginatedResponse<T> = {
  data: T[];
  metadata: PaginationMetadata;
};

type PrescriberOption = {
  id: string;
  full_name: string;
};

type PatientOption = {
  id: string;
  name: string;
};

type LogEntry = {
  id: string;
  event_time: string;
  message: string;
  user?: {
    full_name?: string;
    email?: string;
  } | null;
  patient?: {
    name?: string;
  } | null;
};

const page = ref(1);
const pageJumpInput = ref("1");
const selectedPrescriberId = ref("");
const selectedPatientId = ref("");
const selectedDate = ref("");
const { formatDateTimePtBR } = useDateFormatting();
const prescriberSearch = ref("");
const patientSearch = ref("");
const prescriberOptions = ref<PrescriberOption[]>([]);
const patientOptions = ref<PatientOption[]>([]);
let prescriberSearchTimer: ReturnType<typeof setTimeout> | undefined;
let patientSearchTimer: ReturnType<typeof setTimeout> | undefined;

const searchPrescribers = async () => {
  prescriberOptions.value = await $fetch<PrescriberOption[]>(
    "/api/users/admin/options",
    { query: { q: prescriberSearch.value, limit: 20 } },
  );
};

const searchPatients = async () => {
  patientOptions.value = await $fetch<PatientOption[]>("/api/patients/options", {
    query: { q: patientSearch.value, limit: 20 },
  });
};

const schedulePrescriberSearch = () => {
  selectedPrescriberId.value = "";
  if (prescriberSearchTimer) clearTimeout(prescriberSearchTimer);
  prescriberSearchTimer = setTimeout(searchPrescribers, 250);
};

const schedulePatientSearch = () => {
  selectedPatientId.value = "";
  if (patientSearchTimer) clearTimeout(patientSearchTimer);
  patientSearchTimer = setTimeout(searchPatients, 250);
};

const selectPrescriber = () => {
  selectedPrescriberId.value =
    prescriberOptions.value.find(
      (prescriber) => prescriber.full_name === prescriberSearch.value,
    )?.id || "";
  page.value = 1;
};

const selectPatient = () => {
  selectedPatientId.value =
    patientOptions.value.find(
      (patient) => patient.name === patientSearch.value,
    )?.id || "";
  page.value = 1;
};

const { data: response } = await useFetch<PaginatedResponse<LogEntry>>(
  "/api/logs",
  {
    method: "GET",
    query: {
      page,
      limit: 20,
      userId: selectedPrescriberId,
      patientId: selectedPatientId,
      date: selectedDate,
    },
    watch: [page, selectedPrescriberId, selectedPatientId, selectedDate],
  },
);

const logs = computed(() => response.value?.data || []);
const metadata = computed(
  () => response.value?.metadata || { page: 1, totalPages: 1 },
);

const clearFilters = () => {
  prescriberSearch.value = "";
  patientSearch.value = "";
  selectedPrescriberId.value = "";
  selectedPatientId.value = "";
  selectedDate.value = "";
  page.value = 1;
};

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
</script>

<template>
  <div class="page-header">
    <h1>📝 Registros</h1>
  </div>

  <div class="filter-bar">
    <div class="filter-group">
      <label>Prescritor:</label>
      <input
        v-model="prescriberSearch"
        list="log-prescriber-options"
        placeholder="Digite o nome"
        @input="schedulePrescriberSearch"
        @change="selectPrescriber"
      />
      <datalist id="log-prescriber-options">
        <option
          v-for="prescriber in prescriberOptions"
          :key="prescriber.id"
          :value="prescriber.full_name"
        >
        </option>
      </datalist>
    </div>
    <div class="filter-group">
      <label>Paciente:</label>
      <input
        v-model="patientSearch"
        list="log-patient-options"
        placeholder="Digite o nome"
        @input="schedulePatientSearch"
        @change="selectPatient"
      />
      <datalist id="log-patient-options">
        <option v-for="patient in patientOptions" :key="patient.id" :value="patient.name">
        </option>
      </datalist>
    </div>
    <div class="filter-group">
      <label>Data:</label>
      <input type="date" v-model="selectedDate" @change="page = 1" />
    </div>
    <button
      v-if="selectedPrescriberId || selectedPatientId || selectedDate"
      class="btn-sm"
      @click="clearFilters"
    >
      ✕ Limpar
    </button>
  </div>

  <div class="card">
    <template v-if="logs.length">
      <div class="table-responsive">
        <table class="list-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Mensagem</th>
              <th>Prescritor</th>
              <th>Paciente</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td data-label="Data/Hora">
                <span class="text-muted">{{
                  formatDateTimePtBR(log.event_time)
                }}</span>
              </td>
              <td data-label="Mensagem">{{ log.message }}</td>
              <td data-label="Prescritor">
                <span class="text-muted">{{
                  log.user?.full_name || log.user?.email || "—"
                }}</span>
              </td>
              <td data-label="Paciente">
                <span class="text-muted">{{ log.patient?.name || "—" }}</span>
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
          <label for="admin-logs-page-jump">Ir para</label>
          <input
            id="admin-logs-page-jump"
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
    <div v-else class="empty">Nenhum registro encontrado.</div>
  </div>
</template>
