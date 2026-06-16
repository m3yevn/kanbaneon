<template>
  <div class="wrapper">
    <form @submit.prevent="isLite ? login($event) : loginApi($event)" autocomplete="off">
      <a-card class="card">
        <h2 class="title">
          KAN<span class="subtitle">BANEON</span>
          <span class="version" v-if="isLite"> Lite</span>
        </h2>
        <div class="input-wrapper">
          <a-input v-model:value="username" placeholder="Enter your username or email" autocomplete="new-username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
          <label class="error-label">{{ error.username }}&nbsp;</label>
          <a-input-password v-if="!isLite" v-model:value="password" placeholder="Enter your password" type="password" autocomplete="new-password">
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
        <p class="forgot-link"><router-link to="forgot?type=password">Forgot your username or password?</router-link></p>
        <input type="submit" hidden />
        <a-button :disabled="isLoading" type="primary" size="large" block
          @click="isLite ? login($event) : loginApi($event)">
          <a-spin v-if="isLoading" />
          Login</a-button>
        <div class="form-footer" v-if="!isLite">
          Don't have an account?
          <span>
            <router-link to="/signup">Sign Up Here</router-link>
          </span>
        </div>
      </a-card>
    </form>
  </div>
</template>

<script lang="ts">
import { v4 } from "uuid";
import { INDEXED_DB, browserDB } from "../../helpers/IndexedDbHelper";
import { getExistingUser } from "../../store";
import { login } from "../../helpers/ApiHelper";
import { EyeTwoTone, EyeInvisibleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons-vue';

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
    EyeTwoTone, EyeInvisibleOutlined, UserOutlined, LockOutlined
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
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 24px;
}

.title {
  display: inline;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--kb-accent);
}

.subtitle {
  color: var(--kb-violet);
}

.version {
  font-size: 14px;
  color: var(--kb-muted);
}

.card {
  width: min(420px, 92vw);
}

.input-wrapper {
  margin: 20px 0;
  width: 100%;
}

.form-footer {
  padding-top: 20px;
  color: var(--kb-muted);
  font-size: 0.9rem;
}

.form-footer a {
  color: var(--kb-accent);
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
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
