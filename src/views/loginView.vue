<template>
    <div class="login-container">
        <div class="login-card">
            <transition name="fade-in-left">
                <h1 v-if="1 == 1" class="login-title">Welcome Back</h1>
            </transition>
            <form @submit.prevent class="login-form">
                <!-- invisible form -->
                <input v-model="robotCheck" id="confirm_password" type="text" style="display: none;">
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <x-input v-model="form.email" @input="v$.form.email.$touch()" type="email"
                        placeholder="Enter your email" />
                    <div class="text-red-600 text-sm" v-if="v$.form.email.$error">
                        {{ v$.form.email.$errors[0].$message }}
                    </div>
                </div>
                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <x-input v-model="form.password" @input="v$.form.password.$touch()" type="password"
                        placeholder="Enter your password" />
                    <div class="text-red-600 text-sm" v-if="v$.form.password.$error">
                        {{ v$.form.password.$errors[0].$message }}
                    </div>
                </div>
                <x-button class="w-full" :disabled="v$.form.$invalid" useLoading @clicked="handleSubmit">Log
                    In</x-button>
            </form>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'LoginPage',
    data() {
        return {
            authStore: useAuthStore(),
            form: {
                email: '',
                password: ''
            },
            state: {
                _buttonLoading: false
            },
            robotCheck: '',
            v$: useVuelidate(),
        }
    },
    validations() {
        return {
            form: {
                email: { required, email },
                password: { required, minLength: minLength(6) }
            }
        }
    },
    methods: {
        handleSubmit(resolveLoading) {
            if (this.robotCheck) {
                return;
            }
            if (this.v$.form.$invalid) {
                this.$toast.add({
                    severity: 'error', summary: 'Login Gagal',
                    detail: 'Form login tidak valid.', life: 3000
                });
                return;
            }
            useAuthStore().login(this.form).then((response) => {
                this.$toast.add({
                    severity: 'success', summary: 'Login Sukses',
                    detail: 'Anda berhasil masuk.', life: 3000
                });
                // if query contains redirect, redirect to that page
                if (this.$route.query.redirect) {
                    this.$router.push(this.$route.query.redirect);
                } else {
                    this.$router.push({ name: 'dashboard' });
                }
            }).catch((error) => {
                this.$toast.add({
                    severity: 'error', summary: 'Login Gagal',
                    detail: 'Email atau password salah.', life: 3000
                });
            }).finally(() => {
                if (resolveLoading) {
                    resolveLoading();
                }
            });
        },
    }
}
</script>

<style scoped>
.login-container {
    @apply min-h-screen flex items-center justify-center bg-white p-6;
}

.login-card {
    @apply bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-200 transform transition-all duration-300 ease-in-out hover:shadow-2xl;
}

.login-title {
    @apply text-3xl font-bold text-center text-black mb-6;
}

.login-form {
    @apply space-y-6;
}

.form-group {
    @apply space-y-2;
}

.form-label {
    @apply block text-sm font-medium text-gray-700;
}

.form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 ease-in-out;
}

.bottom-text {
    @apply mt-4 text-center text-sm;
}

.bottom-text a {
    @apply text-gray-600 hover:text-black transition-colors duration-200 ease-in-out;
}


.nav-link {
    @apply relative text-gray-600 hover:text-black transition-colors duration-500;
}

.nav-link::after {
    content: '';
    @apply absolute left-0 bottom-[-1px] w-full h-[1.5px] bg-neutral-700 origin-left scale-x-0;
    transition: transform 0.5s cubic-bezier(.7, 0, .25, 1);
    cursor: default;
}

.nav-link:hover::after {
    @apply scale-x-100;
}

.fade-in-left-enter-active {
    animation: fadeInLeft 1s cubic-bezier(.7, 0, .25, 1);
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translatey(-5px);
    }

    to {
        opacity: 1;
    }
}
</style>
