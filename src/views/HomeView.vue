<template>
    <div class="home-page">
        <div class="content">
            <i class="icon pi pi-shield"></i>
            <h1>Welcome to {{ appdata.title }} </h1>
            <p>Secure. Efficient. Powerful.</p>
            <x-button v-if="!authStore.isAuthenticated" class="login-button"
                @clicked="() => { $router.push({ name: 'login' }) }">Login</x-button>
            <x-button v-else class="login-button"
                @clicked="() => { $router.push({ name: 'dashboard' }) }">Dashboard</x-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    data() {
        return {
            authStore: useAuthStore(),
            appdata,
        }
    },
    methods: {
    },
}
</script>

<style scoped>
.home-page {
    @apply flex flex-col items-center justify-center min-h-screen;
}

.content {
    @apply text-center space-y-4;
}

.icon {
    @apply text-[10rem];
}

h1 {
    @apply text-4xl font-bold;
}

p {
    @apply text-xl text-gray-500;
}

.login-button {
    @apply text-xl p-2 px-5 bg-red-600
}
</style>
