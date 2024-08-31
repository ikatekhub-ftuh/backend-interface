<template>
    <div class="flex justify-center items-center page">
        <form @submit.prevent="onSubmit()" class="card">
            <div>
                <p class="text-heading">Masuk</p>
                <p class="mt-[-5px]">Ke {{ this.default.title }}</p>
            </div>
            <div class="flex flex-col gap-2">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-user"></i>
                    </InputGroupAddon>
                    <InputText v-model="form.email" placeholder="Username" required />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-lock"></i>
                    </InputGroupAddon>
                    <Password v-model="form.password" placeholder="Password" toggleMask :feedback="false" required />
                </InputGroup>
            </div>
            <div>
                <Button :loading="loading" type="submit" label="Masuk" class="w-full" />
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            loading: false,
        }
    },
    methods: {
        ...mapActions({
            login: 'auth/login'
        }),
        onSubmit() {
            this.loading = true;
            this.login(this.form).then((res) => {
                if (res) {
                    this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Login success', life: 3000 });
                    this.$router.push({ name: 'dashboard' });
                }
            }).catch((err) => {
                try {
                    const errorMessage = err.response.data.message.replace('\\n', '\n');
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
                } catch (error) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Login failed', life: 3000 });
                }
            }).finally(() => {
                this.loading = false;
            })
        }
    },
    inject: ['default']
}
</script>

<style scoped>
.card {
    @apply flex flex-col gap-[1rem];
    padding: 2.5rem 2rem;
    border-radius: 16px;
    background-color: rgb(255, 255, 255);
}
</style>
