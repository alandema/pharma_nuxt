<script setup lang="ts">
const email = ref("");
const password = ref("");
const { add: addToast } = useToast();
const { isValidEmail } = useInputFormatting();
const { loadCurrentUser } = useCurrentUser();
const { start: startLoading, finish: finishLoading } = useLoadingIndicator();
const isSubmitting = ref(false);

const isAdminRole = (role?: string) =>
  role === "admin" || role === "superadmin";

const { brand } = useAppConfig();

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  const normalizedEmail = email.value.trim();
  const normalizedPassword = password.value.trim();

  if (!normalizedEmail || !normalizedPassword) {
    addToast("E-mail e senha são obrigatórios.", "error");
    return;
  }

  if (!isValidEmail(normalizedEmail)) {
    addToast("E-mail inválido. Informe um e-mail válido.", "error");
    return;
  }

  isSubmitting.value = true;
  startLoading({ force: true });

  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      body: { email: normalizedEmail, password: normalizedPassword },
    });
    addToast(res.message, "success");

    const user = await loadCurrentUser({ force: true });
    if (!user) {
      addToast(
        "Login realizado, mas não foi possível carregar sua sessão.",
        "error",
      );
      return;
    }

    await navigateTo(isAdminRole(user.role) ? "/admin" : "/");
  } catch (err: any) {
    addToast(
      err?.data?.statusMessage ??
        err?.data?.message ??
        "Falha no login. Verifique suas credenciais.",
      "error",
    );
  } finally {
    isSubmitting.value = false;
    finishLoading({ force: true });
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="card auth-card">
      <img src="/logo.png" alt="Logo da AMMA" class="auth-logo" />
      <p class="text-muted auth-sub">{{ brand.subtitle }}</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="Digite seu e-mail"
            required
            :disabled="isSubmitting"
          />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="Digite sua senha"
            required
            :disabled="isSubmitting"
          />
        </div>
        <button
          type="submit"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting"
        >
          {{ isSubmitting ? "Entrando..." : "Entrar" }}
        </button>
      </form>
    </div>
  </div>
</template>
