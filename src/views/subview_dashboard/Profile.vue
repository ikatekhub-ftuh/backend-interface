<!-- !TODO: -->
<!--  -->

<template>
    <div class="card flex *:h-fit gap-5 flex-wrap">
        {{ alumni.length }}
        <Panel header="Alumni" v-if="Object.keys(alumni).length !== 0" class="flex-[1] min-w-[300px]">
            <div id="alumnifield" class=" *:mb-2 *:*:mb-1">
                <div>
                    <p>Nama</p>
                    <InputText v-model="alumni.nama" fluid readonly placeholder="Nama" />
                </div>
                <div>
                    <p>Tanggal Lahir</p>
                    <DatePicker v-model="alumni.tgl_lahir" :max-date="today" fluid readonly
                        placeholder="Tanggal Lahir" />
                </div>
                <div>
                    <p>No. Telp</p>
                    <InputText v-model="alumni.no_telp" fluid readonly placeholder="No. Telp" />
                </div>
                <div>
                    <p>Jurusan</p>
                    <InputText v-model="alumni.jurusan" fluid readonly placeholder="Jurusan" />
                </div>
                <div>
                    <p>Angkatan</p>
                    <InputText v-model="alumni.angkatan" fluid readonly placeholder="Angkatan" />
                </div>
                <div>
                    <p>No. Anggota</p>
                    <InputText v-model="alumni.no_anggota" fluid readonly placeholder="No. Anggota" />
                </div>
                <div>
                    <p>NIM</p>
                    <InputText v-model="alumni.nim" fluid readonly placeholder="NIM" />
                </div>
                <div>
                    <p>Agama</p>
                    <InputText fluid v-model="alumni.agama" readonly placeholder="Agama" />
                </div>
                <div class="w-full flex justify-center mt-3">
                    <SelectButton v-model="alumni.kelamin" :options="['l', 'p']" disabled>
                        <template #option="{ option }">
                            {{ option === 'l' ? 'Laki-laki' : 'Perempuan' }}
                        </template>
                    </SelectButton>
                </div>
            </div>
        </Panel>
        <Panel header="Account" class="w-fit flex-[1.5] min-w-[300px] max-w-[500px]">
            <template #footer>
                <div class="flex flex-wrap items-center justify-end gap-4">
                    <span class="text-surface-500 dark:text-surface-400">Terakhir diupdate: {{
                        updateAt(getuser.updated_at) }}</span>
                </div>
            </template>
            <template #icons>
                <Button icon="pi pi-shield" text :severity="editmode.account ? 'primary' : 'secondary'"
                    @click="toggleEditMode('account')" />
                <Button icon="pi pi-envelope" text :severity="editmode.email ? 'primary' : 'secondary'"
                    @click="toggleEditMode('email')" />
            </template>

            <img class="avatar" :src="this.default.image + getuser.avatar" @error="onImageError($event)"
                shape="circle" />

            <div class="flex flex-col gap-1 mt-3">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-envelope"></i>
                    </InputGroupAddon>
                    <InputText :readonly="!editmode.account && !editmode.email" type="email" v-model="user.email"
                        placeholder="Email" />
                </InputGroup>
                <sub-yesnocomp v-if="editmode.email" :hideno="true" :off="computedValCheckEmail" @yes="save" />
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
            alumni: {},
            editmode: {
                account: false,
                email: false,
            },
            today: new Date()
        }
    },
    computed: {
        ...mapGetters({
            getuser: 'auth/user'
        }),
        updateAt() {
            // important
            return (dateString) => {
                const timeAgo = useTimeAgo(new Date(dateString));
                return timeAgo;
            }
        },
        computedValCheck() {
            const length = this.user.password.length < 8 || this.user.old_password.length < 8;
            const same = this.user.password !== this.user.password_confirmation;
            const exist = Object.values(this.user).some((val) => val === '');

            return length || same || exist;
        },
        computedValCheckEmail() {
            const exist = Object.values(this.user.email).some((val) => val === '');
            const same = this.user.email === this.getuser.email;
            const email = this.user.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
            return exist || same || !email;
        }
    },
    methods: {
        save() {
            const fd = new FormData();
            fd.append('email', this.user.email);
            if (this.user.old_password) {
                fd.append('old_password', this.user.old_password);
                fd.append('password', this.user.password);
                fd.append('password_confirmation', this.user.password_confirmation);
            }
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

            if (!this.getuser.alumni) return;

            const except = ['updated_at', 'created_at']

            this.alumni = JSON.parse(JSON.stringify(this.getuser.alumni));
            except.forEach(key => delete this.alumni[key]);
        },
        toggleEditMode(context) {
            // checkif context included in this.editmode
            // important, hasOwnProperty and anonymous function
            if (!this.editmode.hasOwnProperty(context)) return;
            const reset = (except) => {
                for (const key in this.editmode) {
                    if (key !== except) {
                        this.editmode[key] = false;
                    }
                }
            }
            reset(context);
            this.editmode[context] = !this.editmode[context];
            this.loadUser();
        }

    },
    mounted() {
        this.loadUser();
    }

}
</script>
