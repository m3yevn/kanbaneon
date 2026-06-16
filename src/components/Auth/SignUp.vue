<template>
  <AuthLayout>
    <a-form ref="formRef" :model="formState" @finish="signUp" autocomplete="new-form" class="auth-form">
      <a-card class="card" :bordered="false">
        <h2 class="title">Create your account</h2>
        <p class="subtitle-text">Start planning with Kanbaneon</p>
        <div class="input-wrapper">
          <a-form-item :name="['username']"
            :rules="[{ required: true, message: 'Username is required.' }, { validator: validateUsername, message: 'Username must be 5-20 characters long and contain only lowercase letters, numbers, or underscores (no special characters or dashes).' }]">
            <a-input v-model:value="formState.username" placeholder="Username" autocomplete="new-username">
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item :name="['email']"
            :rules="[{ required: true, message: 'Email is required.' }, { type: 'email', message: 'This is not a valid email.' }]">
            <a-input v-model:value="formState.email" placeholder="Email" autocomplete="new-email">
              <template #prefix>
                <MailOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item :name="['password']"
            :rules="[{ required: true, message: 'Password is required.' }, { validator: validatePassword, message: 'Password must have 8-24 characters long and include at least a uppercase letter, a lowercase letter, a number, and a special character.' }]">
            <a-input-password v-if="!isLite" v-model:value="formState.password" placeholder="Password"
              type="password" autocomplete="new-password">
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
              <template #iconRender="v">
                <EyeTwoTone v-if="v"></EyeTwoTone>
                <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
              </template>
            </a-input-password>
          </a-form-item>
        </div>
        <p class="legal-line">By signing up you agree to our <router-link to="/terms-and-conditions">Terms</router-link> and <router-link to="/privacy-policy">Privacy Policy</router-link>.</p>
        <input type="submit" hidden />
        <a-button :disabled="isLoading" type="primary" size="large" block @click="signUp($event)">
          <a-spin v-if="isLoading" />
          Create account</a-button>
        <div class="form-footer">
          Already have an account?
          <router-link to="/login">Sign in</router-link>
        </div>
      </a-card>
    </a-form>
  </AuthLayout>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import { signUp } from "../../helpers/ApiHelper";
import { EyeTwoTone, EyeInvisibleOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons-vue';
import AuthLayout from "./AuthLayout.vue";

export default {
  data: () => {
    return {
      // @ts-ignore
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      isLoading: false,
      formState: {
        username: "",
        email: "",
        password: "",
      }
    };
  },
  components: {
    EyeTwoTone, EyeInvisibleOutlined, UserOutlined, MailOutlined, LockOutlined, AuthLayout
  },
  methods: {
    async validateUsername(_, value) {
      if (!value) {
        return Promise.reject();
      }
      const regex = /^[a-z0-9_]{5,20}$/;
      if (!regex.test(value)) {
        return Promise.reject();
      }
      return Promise.resolve();
    },
    async validatePassword(_, value) {
      if (!value) {
        return Promise.reject();
      }
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;
      if (!regex.test(value)) {
        return Promise.reject();
      }
      return Promise.resolve();
    },
    async signUp(e) {
      e.preventDefault();
      this.isLoading = true;
      try {
        const user = await signUp(this.formState);
        if (!!user?.success) {
          message.success("Account created — sign in to continue.");
          this.$router.push("/login");
        } else if (user && user.message) {
          message.error(user.message);
        }
      } catch (ex) {
        message.error("Sign up failed. Please try again.");
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
}

.subtitle-text {
  color: var(--kb-muted);
  margin: 0 0 16px;
  font-size: 0.9rem;
}

.card {
  width: 100%;
  border: 1px solid var(--kb-border) !important;
  border-radius: var(--kb-radius-lg) !important;
}

.legal-line {
  font-size: 0.8rem;
  color: var(--kb-muted);
  margin-bottom: 16px;
}

.form-footer {
  padding-top: 20px;
  color: var(--kb-muted);
}

.form-footer a {
  color: var(--kb-accent);
  margin-left: 4px;
}
</style>
