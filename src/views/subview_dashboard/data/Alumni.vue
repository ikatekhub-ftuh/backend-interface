<!-- logika ke backend pi kekna -->
<!-- !add feat: delete (confirm with admin password), etc  -->

<template>
    <div id="main" class="flex flex-col gap-5 main">
        <Message severity="info" icon="pi pi-database" v-if="appstate.cached" closable>
            <span>
                Menggunakan data cache.
                <span class="link" @click="getItem(true)">Klik untuk refresh</span>
            </span>
        </Message>
        <Message severity="info" icon="pi pi-clock" v-if="appstate.cached" closable>
            <span>
                Terakhir diambil pada {{ getLastFetchTime() }}
            </span>
        </Message>
        <DataTable removableSort ref="maintable" :value="items" paginator showGridlines :rows="10" :size="appstate.size.value" v-model:filters="appstate.filters.maintable"
            :rowsPerPageOptions="[5, 10, 15]" dataKey="id_alumni" :globalFilterFields="['id_alumni', 'nim', 'nama', 'tgl_lahir', 'jurusan', 'no_telp', 'angkatan', 'kelamin', 'agama', 'golongan_darah', 'validated', 'id_user']">
            <template #header>
                <div class="flex justify-between">
                    <SelectButton v-model="appstate.size" size="small" :options="appstate.sizeOptions" optionLabel="label"
                        dataKey="label" />
                    <div class="flex flex-row gap-1 justify-center items-center">
                        <Button v-if="!appstate.selectionMode" :size="appstate.size.value" class="h-full" text severity="secondary">
                            <span class="pi pi-trash"></span>
                        </Button>
                        <div v-else>
                            <Button :size="appstate.size.value" icon="pi pi-trash" label="Hapus" class="h-full" text
                                severity="danger" />
                            <Button :size="appstate.size.value" icon="pi pi-times" label="Cancel" class="h-full" text
                                severity="secondary" />
                        </div>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="appstate.filters.maintable['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </div>
            </template>
            <Column field="id_alumni" header="ID" sortable />
            <Column field="nim" header="NIM"></Column>
            <Column field="nama" header="Nama" sortable />
            <Column field="tgl_lahir" header="Tanggal Lahir" sortable />
            <Column field="jurusan" header="Jurusan" sortable></Column>
            <Column field="no_telp">
                <template #header>
                    <span class="text-nowrap font-semibold">Nomor Telp</span>
                </template>
                <template #body="slotProps">
                    <span class="text-nowrap px-2 py-3 cursor-pointer hover:bg-gray-200 w-fit select-none"
                        @click="toggleVisibility('phone', slotProps.data.no_telp)"
                        :href="'tel:' + slotProps.data.no_telp">{{ appstate.visibility.phone[slotProps.data.no_telp] ?
                            slotProps.data.no_telp : '*********' }}</span>
                    <span v-if="appstate.visibility.phone[slotProps.data.no_telp]"
                        class="text-nowrap px-2 py-3 cursor-pointer hover:bg-gray-200 w-fit"
                        @click="helper().copyToClipboard(slotProps.data.no_telp)">
                        <i class="pi pi-copy"></i>
                    </span>
                </template>
            </Column>
            <Column field="angkatan" header="Angkatan" sortable />
            <Column field="kelamin" header="Kelamin" sortable>
                <template #body="slotProps">
                    <Tag class="text-nowrap" :severity="slotProps.data.kelamin === 'l' ? 'info' : 'error'">
                        {{ slotProps.data.kelamin === 'l' ? 'Laki-laki' : 'Perempuan' }}
                    </Tag>
                </template>
            </Column>
            <Column field="agama" header="Agama" sortable />
            <Column field="golongan_darah" header="Golongan Darah" sortable />
            <Column field="validated" header="Tervalidasi" sortable>
                <template #body="slotProps">
                    <Tag class="text-nowrap" :severity="slotProps.data.validated ? 'success' : 'danger'">
                        {{ slotProps.data.validated ? 'Tervalidasi' : 'Belum tervalidasi' }}
                    </Tag>
                </template>
            </Column>
            <Column header="User" sortable>
                <template #body="slotProps">
                    <span v-if="slotProps.data.id_user">{{ slotProps.data.id_user }}</span>
                    <Tag class="text-nowrap" severity="error" v-else>Belum terdaftar</Tag>
                </template>
            </Column>
            <Column header="Action">
                <template #body="slotProps">
                    <div class="flex flex-row gap-1">
                        <Button :size="appstate.size.value" severity="danger">
                            <span class="pi pi-trash"></span>
                        </Button>
                        <Button :size="appstate.size.value" severity="info">
                            <span class="pi pi-eye"></span>
                        </Button>
                        <Button :size="appstate.size.value" severity="warn">
                            <span class="pi pi-pencil"></span>
                        </Button>
                    </div>
                </template>
            </Column>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text @click="getItem(true)" />
            </template>
            <template #paginatorend>
                <Button icon="pi pi-external-link" label="Export" text @click="helper().exportCSV('maintable')" />
            </template>
        </DataTable>
    </div>
</template>

<script>
import { FilterMatchMode } from '@primevue/core/api';

export default {
    data() {
        const KEY = 'alumni';
        const stateObject = useIDBKeyval(`${KEY}-object`, {
            data: [],
        });
        const localState = ref(stateObject);
        watch(localState, (newValue) => {
            stateObject.value = newValue;
        }, { deep: true });

        return {
            localState,
            appstate: {
                key: KEY,
                cached: false,
                cacheDuration: 1000 * 60 * 60,
                visibility: {
                    phone: {},
                },
                selectionMode: false,
                size: localStorage.getItem('appstate.size') ? JSON.parse(localStorage.getItem('appstate.size')) : { label: 'Normal', value: 'null' },
                sizeOptions: [
                    { label: 'Small', value: 'small' },
                    { label: 'Normal', value: 'null' },
                    { label: 'Large', value: 'large' }
                ],
                filters: {
                    maintable: {
                        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                    },
                },
            },
            items: [],
        }
    },
    methods: {
        toggleVisibility(type, key) {
            if (!this.appstate.visibility[type]) { this.appstate.visibility[type] = {} }
            this.appstate.visibility[type][key] = !this.appstate.visibility[type][key];
        },
        getLastFetchTime() {
            const lastFetches = JSON.parse(localStorage.getItem('lastFetches')) || {};
            // watch
            if (lastFetches[this.appstate.key]) {
                const date = new Date(parseInt(lastFetches[this.appstate.key]));
                const timeAgo = useTimeAgo(date);
                return timeAgo;
            }
            return 'Never';
        },
        async loadIndexedDB(timeout = 5000) {
            return new Promise((resolve, reject) => {
                const checkIndexedDB = setInterval(() => {
                    if (this.localState.data) {
                        clearInterval(checkIndexedDB);
                        resolve();
                    }
                }, 100);
                setTimeout(() => {
                    clearInterval(checkIndexedDB);
                    reject(new Error('IndexedDB load timeout'));
                }, timeout);
            });
        },
        getItem(force = false) {
            const now = new Date().getTime();
            const lastFetches = JSON.parse(localStorage.getItem('lastFetches')) || {};
            const cacheditems = JSON.stringify(this.localState.data);

            // watch
            if (lastFetches[this.appstate.key] && cacheditems && (now - lastFetches[this.appstate.key] < this.appstate.cacheDuration) && !force) {
                this.items = JSON.parse(cacheditems);
                this.appstate.cached = true;
                return;
            }

            axios.get('alumni/admin')
                .then((res) => {
                    console.log(res.data.data);
                    this.items = res.data.data;
                    this.localState.data = res.data.data;
                    this.appstate.cached = false;
                    lastFetches[this.appstate.key] = now;
                    localStorage.setItem('lastFetches', JSON.stringify(lastFetches));
                    this.helper().createToast('success', 'Data fetched');
                })
                .catch((err) => {
                    console.log(err)
                    this.helper().createToast('error', err.response.data.message);
                });
        },
        helper() {
            const createToast = (type, detail) => {
                type = type || 'info';
                type = type.toLowerCase();
                this.$toast.add({
                    severity: type,
                    summary: type.charAt(0).toUpperCase() + type.slice(1),
                    detail,
                    life: 3000,
                });
            };
            const copyToClipboard = (text) => {
                navigator.clipboard.writeText(text).then(() => {
                    createToast('info', 'Copied to clipboard');
                }).catch((err) => {
                    createToast('error', 'Failed to copy to clipboard');
                });
            };
            const exportCSV = (tableRef) => {
                this.$refs[tableRef].exportCSV();
            };
            return {
                createToast,
                copyToClipboard,
                exportCSV,
            };
        },
    },
    watch: {
        'appstate.size': {
            handler() {
                localStorage.setItem('appstate.size', JSON.stringify(this.appstate.size));
            },
            deep: true,
        },
    },
    async mounted() {
        await this.loadIndexedDB();
        this.getItem();
    },
}
</script>

<style scoped>
.gender {
    padding: 0.2rem 0.5rem;
    border-radius: 0.5rem;
    background-color: #e8eaf7;
    color: #333;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: capitalize;
    display: inline-block;
    cursor: default;
}

.gender.male {
    background-color: #e3f2fd;
}

.gender.female {
    background-color: #f8bbd0;
    color: #434343;
}
</style>
