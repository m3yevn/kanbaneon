<template>
  <AuthLayout>
    <form @submit.prevent="isLite ? login($event) : loginApi($event)" autocomplete="off" class="auth-form">
      <a-card class="card" :bordered="false">
        <h2 class="title">Welcome back</h2>
        <p class="subtitle-text">Sign in to your workspace</p>
        <div class="input-wrapper">
          <a-input v-model:value="username" placeholder="Username or email" autocomplete="username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
          <label class="error-label">{{ error.username }}&nbsp;</label>
          <a-input-password v-if="!isLite" v-model:value="password" placeholder="Password" autocomplete="current-password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
            <template #iconRender="v">
              <EyeTwoTone v-if="v"></EyeTwoTone>
              <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
            </template>
          </a-input-password>
          <label v-if="!isLite" class="error-label">{{ error.password }}&nbsp;</label>
        </div>
        <p class="forgot-link"><router-link to="forgot?type=password">Forgot username or password?</router-link></p>
        <input type="submit" hidden />
        <a-button :disabled="isLoading" type="primary" size="large" block
          @click="isLite ? login($event) : loginApi($event)">
          <a-spin v-if="isLoading" />
          Sign in</a-button>
        <div class="form-footer" v-if="!isLite">
          No account?
          <router-link to="/signup">Create one</router-link>
        </div>
      </a-card>
    </form>
  </AuthLayout>
</template>

<script lang="ts">
import { v4 } from "uuid";
import { INDEXED_DB, browserDB } from "../../helpers/IndexedDbHelper";
import { getExistingUser } from "../../store";
import { login } from "../../helpers/ApiHelper";
import { EyeTwoTone, EyeInvisibleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import AuthLayout from "./AuthLayout.vue";

export default {
  data: () => {
    return {
      // @ts-ignore
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      isLoading: false,
      username: "",
      password: "",
      error: { username: "", password: "" },
    };
  },
  components: {
    EyeTwoTone, EyeInvisibleOutlined, UserOutlined, LockOutlined, AuthLayout
  },
  methods: {
    async login(e) {
      e.preventDefault();
      let userId = await getExistingUser(this.username);
      if (!userId) {
        userId = v4();
        await browserDB.put(INDEXED_DB.objectStores.KANBANEON, "users", {
          [this.username]: userId,
        });
      }

      this.$store.commit("setUser", {
        username: this.username,
        isLoggedIn: true,
        id: userId,
      });
      this.$router.push("/");
    },
    async loginApi(e) {
      e.preventDefault();
      this.isLoading = true;
      this.error = { username: '', password: '' };
      try {
        const user = await login(this.username, this.password);
        if (!!user?.success) {
          this.$store.commit("setUser", {
            username: this.username,
            isLoggedIn: true,
            ...user
          });
          localStorage.setItem("token", user.token);
          this.$router.push("/");
        } else if (user && user.message) {
          this.error.password = user.message;
        } else {
          this.error.password = "Login failed. Please try again.";
        }
      } catch (ex) {
        this.error.password = "An unexpected error occurred. Please try again.";
        console.error(ex);
      }
      finally {
        this.isLoading = false;
      }
    }
  },
};
</script>

<style lang="css" scoped>
.auth-form {
  width: min(420px, 92vw);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px;
  color: var(--kb-text);
}

.subtitle-text {
  color: var(--kb-muted);
  margin: 0 0 20px;
  font-size: 0.9rem;
}

.card {
  width: 100%;
  box-shadow: var(--kb-shadow);
  border: 1px solid var(--kb-border) !important;
  border-radius: var(--kb-radius-lg) !important;
}

.input-wrapper {
  margin: 0 0 8px;
  width: 100%;
}

.form-footer {
  padding-top: 20px;
  color: var(--kb-muted);
  font-size: 0.9rem;
}

.form-footer a {
  color: var(--kb-accent);
  margin-left: 4px;
}

.forgot-link {
  text-align: right;
  margin: 8px 0 16px;
  font-size: 0.85rem;
}

.forgot-link a {
  color: var(--kb-muted);
}
</style>
