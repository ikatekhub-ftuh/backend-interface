<!-- !TODO: -->
<!-- *Show Alumni Data if Exist -->

<template>
    <div class="card">
        <Panel header="Account" class="w-fit">
            <template #footer>
                <div class="flex flex-wrap items-center justify-end gap-4">
                    <span class="text-surface-500 dark:text-surface-400">Terakhir diupdate: {{ updateAt }}</span>
                </div>
            </template>
            <template #icons>
                <Button icon="pi pi-pencil" text :severity="editmode.account ? 'primary' : 'secondary'"
                    @click="toggleEditMode" />
            </template>

            <img class="avatar" :src="this.default.image + getuser.avatar" @error="onImageError($event)"
                shape="circle" />

            <div class="flex flex-col gap-1 mt-3">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-envelope"></i>
                    </InputGroupAddon>
                    <InputText :readonly="!editmode.account" type="email" v-model="user.email" placeholder="Email"
                        autocomplete="no-autocomplete" />
                </InputGroup>
                <div v-if="editmode.account" class="mb-3 flex flex-col gap-2 mt-3">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock"></i>
                        </InputGroupAddon>
                        <InputText v-model="user.old_password" :readonly="!editmode.account" type="password"
                            placeholder="Password Lama" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock"></i>
                        </InputGroupAddon>
                        <InputText v-model="user.password" :readonly="!editmode.account" type="password"
                            placeholder="Password Baru" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock"></i>
                        </InputGroupAddon>
                        <InputText v-model="user.password_confirmation" :readonly="!editmode.account"
                            :invalid="value === null" type="password" placeholder="Konfirmasi Password" />
                    </InputGroup>
                </div>
                <sub-yesnocomp v-if="editmode.account" :hideno="true" :off="computedValCheck" @yes="save" />
            </div>
        </Panel>
    </div>
</template>

<style scoped>
.avatar {
    @apply w-20 h-20 rounded-full;
}
</style>

<script>

export default {
    inject: ['default'],
    data() {
        return {
            user: {},
            editmode: {
                account: false
            }
        }
    },
    computed: {
        ...mapGetters({
            getuser: 'auth/user'
        }),
        updateAt() {
            const timeAgo = useTimeAgo(new Date(this.getuser.updated_at));
            return timeAgo;
        },
        computedValCheck() {
            const length = this.user.password.length < 8 || this.user.old_password.length < 8;
            const same = this.user.password !== this.user.password_confirmation;
            const exist = Object.values(this.user).some((val) => val === '');

            return length || same || exist;
        }
    },
    methods: {
        save() {
            const fd = new FormData();
            fd.append('email', this.user.email);
            fd.append('password', this.user.password);
            fd.append('password_confirmation', this.user.password_confirmation);
            this.$store.dispatch('auth/update', this.user).then((res) => {
                if (res) {
                    this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Account updated', life: 3000 });
                    this.toggleEditMode();
                }
            }).catch((err) => {
                console.log(err);
                try {
                    const errorMessage = err.response.data.message.replace('\\n', '\n');
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
                } catch (error) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Update failed', life: 3000 });
                }
            });
        },
        async onImageError(event) {
            const fallback = await import('../../assets/logo.png');
            event.target.src = fallback.default;
        },
        loadUser() {
            this.user = {
                email: this.getuser.email,
                old_password: '',
                password: '',
                password_confirmation: ''
            };
        },
        toggleEditMode() {
            this.editmode.account = !this.editmode.account;
            this.loadUser();
        }

    },
    mounted() {
        this.loadUser();
    }

}
</script>
