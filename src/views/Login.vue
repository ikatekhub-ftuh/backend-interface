<template>
    <div class="flex justify-center items-center page">
        <!-- debug -->
        <div class="top-0 absolute">
            {{ form }}
        </div>
        <!-- main -->
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
                <Button type="submit" label="Masuk" class="w-full" />
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
        }
    },
    methods: {
        ...mapActions({
            login: 'auth/login'
        }),
        onSubmit() {
            this.login(this.form).then((res) => {
                if (res) {
                    console.log(res)
                    this.$router.push({ name: 'dashboard' });
                }
            }).catch((err) => {
                console.log(err)
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
    box-shadow: 2px 5px 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
