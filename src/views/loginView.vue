<template>
    <div class="login-container">
        <div class="login-card">
            <transition name="fade-in-left">
                <h1 v-if="showTitle" class="login-title">Welcome Back</h1>
            </transition>
            <form @submit.prevent class="login-form">
                <!-- invisible form -->
                <input v-model="robotCheck" type="text" style="display: none;">
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
            <div class="bottom-text">
                <router-link :to="{ name: 'home' }" class="nav-link">Register</router-link>
                <span>
                    or
                </span>
                <router-link :to="{ name: 'home' }" class="nav-link" @click.prevent="handleForgotPassword">Recover
                    Account</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginPage',
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            isLoading: false,
            robotCheck: '',
            v$: useVuelidate(),
            showTitle: false
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
    mounted() {
        this.showTitle = true;
    },
    methods: {
        handleSubmit(resolveLoading) {
            console.log('Login attempt with:', this.form);
            setTimeout(() => {
                resolveLoading();
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Login successful', life: 3000 });
                this.$router.push({ name: 'home' });
            }, 2000);
        },
        handleForgotPassword() {
            // Handle forgot password logic
            console.log('Forgot password clicked');
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
