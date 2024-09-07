<template>
    <div class="flex flex-col gap-5 main">
        <Message severity="info" icon="pi pi-database" v-if="cached" closable>
            <span>
                Menggunakan data cache.
                <span class="link" @click="onStart(true)">Klik untuk refresh</span>
            </span>
        </Message>
        <Message severity="info" icon="pi pi-clock" v-if="cached" closable>
            <span>
                Terakhir diambil pada {{ getLastFetchTime() }}
            </span>
        </Message>
        <DataTable removableSort showGridlines v-model:filters="filters" ref="dt" v-model:selection="selectedItem"
            :value="items" paginator :rows="10" :globalFilterFields="['id_event', 'judul', 'tgl_event', 'lokasi_event']"
            :rowsPerPageOptions="[5, 10, 15]" :size="size.value" dataKey="id_event">
            <template #header>
                <div class="flex justify-between">
                    <SelectButton v-model="size" size="small" :options="sizeOptions" optionLabel="label"
                        dataKey="label" />
                    <div class="flex flex-row gap-1 justify-center items-center">
                        <Button v-if="!selectionMode" :size="size.value" class="h-full" text
                            @click="multipleDeletionToggle()" severity="secondary">
                            <span class="pi pi-trash"></span>
                        </Button>
                        <!-- delete or cancel -->
                        <div v-else>
                            <Button :size="size.value" icon="pi pi-trash" label="Hapus" class="h-full" text
                                @click="multipleDeletionToggle('commit', $event)" severity="danger" />
                            <Button :size="size.value" icon="pi pi-times" label="Cancel" class="h-full" text
                                @click="multipleDeletionToggle('cancel')" severity="secondary" />
                        </div>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </div>
            </template>
            <Column v-if="selectionMode" selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column sortable field="id_event" header="ID"></Column>
            <Column sortable field="judul" header="Judul"></Column>
            <Column sortable field="tgl_event" header="Tanggal Event"></Column>
            <Column sortable field="lokasi_event" header="Lokasi Event"></Column>
            <Column sortable field="kuota" header="Kuota">
                <template #body="slotProps">
                    <Button :size="size.value" severity="info" @click="openModal('peserta', slotProps.data.id_event)">
                        <span class="pi pi-user"></span>
                        <span class="text-nowrap">{{ slotProps.data.peserta }} / {{ slotProps.data.kuota }}</span>
                    </Button>
                </template>
            </Column>
            <Column header="Action">
                <template #body="slotProps">
                    <div class="flex flex-row gap-1">
                        <Button :size="size.value" @click="onDelete(slotProps.data.id_event, $event)" severity="danger">
                            <span class="pi pi-trash"></span>
                        </Button>
                        <Button :size="size.value" @click="openModal('view', slotProps.data.id_event)" severity="info">
                            <span class="pi pi-eye"></span>
                        </Button>
                        <Button :size="size.value" @click="openModal('edit', slotProps.data.id_event)" severity="warn">
                            <span class="pi pi-pencil"></span>
                        </Button>
                    </div>
                </template>
            </Column>
            <!-- invisible -->
            <Column field="deskripsi" header="Deskripsi" class="hidden"></Column>
            <Column field="penyelenggara" header="Penyelenggara" class="hidden"></Column>
            <Column field="gambar" header="Gambar" class="hidden"></Column>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text @click="onStart(true)" />
            </template>
            <template #paginatorend>
                <Button icon="pi pi-external-link" label="Export" text @click="exportCSV()" />
            </template>
        </DataTable>
    </div>


    <Dialog v-if="modalData.items" v-model:visible="modal.viewVisible" modal maximizable dismissableMask
        :header="modalData.header" @hide="() => { modalData = { newData: null } }" :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '80vw', '575px': '100vw' }">
        <div class="fluid *:mb-1">
            <Message severity="info" icon="pi pi-database" v-if="modalData.usingCache" closable>
                <span>
                    Menggunakan data cache. <span class="link" @click="onStart(true, 'view')">Klik untuk refresh</span>
                </span>
            </Message>
            <div class="flex justify-center items-center bg-slate-100 !mb-2">
                <Image :src="this.default.image + modalData.items.gambar" :alt="`image of ${modalData.items.judul}`"
                    class="w-full lg:max-w-[50vw] md:max-w-[70vw] sm:max-w-[80vw]" preview>
                    <template #image>
                        <img :src="this.default.image + modalData.items.gambar" @error="hideMySelf"
                            class="h-auto w-full aspect-video lg:max-w-[50vw] md:max-w-[70vw] sm:max-w-[80vw]" />
                    </template>
                </Image>
            </div>
            <div>
                <h2 class="font-semibold text-2xl">{{ modalData.items.judul }}</h2>
            </div>
            <div>
                <span class="font-medium">By {{ modalData.items.penyelenggara }}</span>
            </div>
            <div class="font-semibold flex items-center">
                <span class="pi pi-map-marker mr-2"></span>{{ modalData.items.lokasi_event }}
            </div>
            <div class="font-semibold flex items-center">
                <span class="pi pi-user mr-2"></span>{{ modalData.items.peserta }} / {{ modalData.items.kuota }}
            </div>
            <div class="font-semibold">
                <span class="pi pi-calendar mr-2"></span>{{ formattedDate(modalData.items.tgl_event) }}
                <span class="font-normal text-gray-600"> ({{ daysLeft(modalData.items.tgl_event) }})</span>
            </div>
            <div class="max-w-max overflow-y-scroll max-h-[400px]">{{ modalData.items.deskripsi }}</div>
            <Panel header="Konten" toggleable>
                <div class="prose w-full max-w-full overflow-y-scroll max-h-[700px]" v-html="modalData.items.konten">
                </div>
            </Panel>
        </div>
    </Dialog>

    <Dialog v-if="modalData.items" v-model:visible="modal.editVisible" modal maximizable dismissableMask
        :header="modalData.header" @hide="() => { modalData = { newData: null } }" :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '80vw', '575px': '100vw' }">
        {{ modalData }}
        <div class="fluid *:mb-2 *:max-w-[400px]">
            <div class="max-w-full">
                <p class="font-semibold text-lg">Thumbnail</p>
                <sub-advpic ref="AdvPic" @changeImg="changeImg" />
            </div>
            <div>
                <p class="font-semibold text-lg">Judul</p>
                <InputText fluid v-model="modalData.items.judul" placeholder="Judul event"
                    v-tooltip.bottom="{ value: 'Masukkan judul event anda di sini', showDelay: 1000, hideDelay: 300 }" />
            </div>
            <div>
                <p class="font-semibold text-lg">Penulis</p>
                <InputText fluid v-model="modalData.items.penyelenggara" placeholder="Penulis event"
                    v-tooltip.bottom="{ value: 'Masukkan nama penulis event anda di sini', showDelay: 1000, hideDelay: 300 }" />
            </div>
            <div>
                <p class="mb-2 font-semibold text-xl">Tanggal Event</p>
                <DatePicker fluid v-model="modalData.items.tgl_event" :min-date="minDate" placeholder="Tanggal Event"
                    showIcon />
                <p class="info" v-if="modalData.items.tgl_event">{{ daysLeft(modalData.items.tgl_event) }}</p>
            </div>
            <div>
                <p class="mb-2 font-semibold text-xl">Lokasi</p>
                <InputText fluid v-model="modalData.items.lokasi_event" placeholder="Lokasi Event"
                    v-tooltip.bottom="{ value: 'Masukkan nama lokasi event di sini', showDelay: 1000, hideDelay: 300 }" />
            </div>
            <div>
                <p class="mb-2 font-semibold text-xl">Kuota</p>
                <InputNumber showButtons buttonLayout="horizontal" :min="1" v-model="modalData.items.kuota"
                    inputId="withoutgrouping" :useGrouping="false" :step="25" fluid>
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>
            </div>
            <div class="overflow-y-scroll max-h-[400px] max-w-full">
                <p class="font-semibold text-lg">Deskripsi</p>
                <Textarea class="w-full" v-model="modalData.items.deskripsi" rows="5" cols="30"
                    placeholder="Deskripsi event"
                    v-tooltip.bottom="{ value: 'Masukkan deskripsi event anda di sini', showDelay: 1000, hideDelay: 300 }" />
            </div>
            <div class="max-w-full">
                <p class="font-semibold text-lg">Artikel</p>
                <div>
                    <Editor v-model="modalData.items.konten"></Editor>
                </div>
            </div>
            <div class="flex items-center gap-2 max-w-full">
                <sub-yesnocomp :off="computedVerification" :submitloading="buttonState.submit_loading" @yes="onSubmit()"
                    @no="onClear()" />
            </div>
        </div>
    </Dialog>

    <!-- IMPORTANT, use v-model -->
    <Dialog v-if="modalData.peserta" v-model:visible="modal.pesertaVisible" modal dismissableMask
        :header="modalData.header" @hide="() => { modalData = { newData: null } }">
        <DataTable showGridlines v-if="modalData.peserta.length != 0" ref="dt2" :value="modalData.peserta" paginator
            v-model:filters="filters_peserta" :rows="5" :size="size.value"
            :globalFilterFields="['id_user', 'nama', 'waktu_daftar']" :rowsPerPageOptions="[5, 10, 15]"
            dataKey="id_user" removableSort>
            <template #header>
                <div class="flex justify-between">
                    <div class="flex flex-row gap-1 justify-center items-center">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters_peserta['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </div>
            </template>
            <Column field="id_user" sortable header="ID User"></Column>
            <Column field="nama" sortable header="Nama"></Column>
            <Column field="waktu_daftar" sortable header="Waktu Daftar">
                <template #body="slotProps">
                    <span>{{ formattedDate(slotProps.data.waktu_like) }}</span>
                </template>
            </Column>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text @click="onStart(true, 'peserta')" />
            </template>
            <template #paginatorend>
                <Button icon="pi pi-external-link" label="Export" text @click="exportCSV('dt2')" />
            </template>
        </DataTable>

        <div v-else>
            <p class="text-2xl font-semibold w-full text-center !text-gray-400">Data tidak ditemukan.</p>
        </div>
    </Dialog>
</template>

<script>
import { FilterMatchMode } from '@primevue/core/api';

export default {
    inject: ['default'],
    data() {
        const KEY = 'events';
        const stateObject = useIDBKeyval(`${KEY}-object`, {
            data: [],
        });

        const localState = ref(stateObject);

        watch(localState, (newValue) => {
            stateObject.value = newValue;
        }, { deep: true });

        return {
            key: KEY,
            localState,
            selectionMode: false,
            minDate: new Date(),
            items: [
            ],
            size: localStorage.getItem('appstate.size') ? JSON.parse(localStorage.getItem('appstate.size')) : { label: 'Normal', value: 'null' },
            sizeOptions: [
                { label: 'Small', value: 'small' },
                { label: 'Normal', value: 'null' },
                { label: 'Large', value: 'large' }
            ],
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            },
            filters_peserta: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            },
            selectedItem: null,
            cacheDuration: 1000 * 60 * 60,
            cached: false,
            modal: {
                viewVisible: false,
                editVisible: false,
                pesertaVisible: false,
            },
            modalData: {
                newData: null,
            },
            cats: [],
            buttonState: {
                submit_loading: false,
            },
            exportType: null,
        };
    },
    computed: {
        formattedDate() {
            return (dateString) => {
                const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                return new Date(dateString).toLocaleDateString('id-ID', options);
            };
        },
        daysLeft() {
            return (dateString) => {
                // if date is today
                if (new Date(dateString).toDateString() === new Date().toDateString()) {
                    return "Hari ini";
                }

                if (new Date(dateString) < new Date()) {
                    return "Event telah melewatkan waktu mulai";
                }

                const date = new Date(dateString);
                const now = new Date();
                const diffTime = Math.abs(date - now);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return `${diffDays} Hari lagi`;
            };
        },
        computedVerification() {
            return Object.values(this.modalData.items).some((val) => val === null || val === undefined || val === '' || val.length === 0);
        },
        selectedItemId() {
            // watch
            return this.selectedItem ? this.selectedItem.map((item) => item.id_event) : [];
        },
    },
    methods: {
        changeImg(newData) {
            this.modalData.newData = newData;
        },
        async exportCSV() {
            this.$refs.dt.exportCSV();
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
        hideMySelf(event) {
            event.target.style.display = 'none';
        },
        async onStart(force = false, from = null) {
            if (from) {
                this.modalData = { newData: null };
                switch (from) {
                    case 'view':
                        this.modal.viewVisible = false;
                        break;
                    case 'edit':
                        this.modal.editVisible = false;
                        break;
                    default:
                        break;
                }
            }

            const now = new Date().getTime();
            const lastFetches = JSON.parse(localStorage.getItem('lastFetches')) || {};
            const cacheditems = JSON.stringify(this.localState.data.data);

            if (lastFetches.events && cacheditems && (now - lastFetches.events < this.cacheDuration) && !force) {
                this.items = JSON.parse(cacheditems);
                this.cached = true;
                return;
            }

            axios.get('event?all').then((res) => {
                this.items = res.data.data.data
                // watch
                lastFetches.events = now;
                localStorage.setItem('lastFetches', JSON.stringify(lastFetches));
                this.localState.data.data = this.items;
                this.cached = false;
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });
            }).catch((err) => {
                console.log(err);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
            })
        },
        openModal(context, id, event) {
            if (id) {
                // watch
                const items = this.localState.data.data.find((item) => item.id_event === id);
                const { cloned, sync } = useCloned(items)
                this.modalData.items = cloned;
                if (this.cached) {
                    this.modalData.usingCache = true;
                }
            }


            switch (context) {
                case 'view':
                    this.modalData.header = `View event`;
                    this.modal.viewVisible = true;
                    break;
                case 'edit':
                    this.modalData.header = `Edit event`;
                    this.modal.editVisible = true;
                    break;
                case 'peserta':
                    this.modalData.header = `Peserta event`;
                    const paramform = {
                        params: {
                            id_event: id,
                        },
                    }
                    axios.get('event/list-peserta', paramform).then((res) => {
                        this.modalData.peserta = res.data.data;
                    }).catch((err) => {
                        console.log(err);
                    });

                    this.modal.pesertaVisible = true;
                    break;
                default:
                    break;
            }
        },

        onDelete(id, event) {
            this.$confirm.require({
                target: event.currentTarget,
                icon: 'pi pi-exclamation-triangle',
                acceptProps: { label: 'Ya', severity: 'success' },
                rejectProps: { label: 'Tidak', severity: 'warning' },
                group: window.innerWidth < 1024 ? 'dialog' : 'popup',
                header: 'Konfirmasi Penghapusan',
                message: 'Data yang dihapus tidak bisa dipulihkan',
                accept: () => {
                    // watch
                    axios.delete('event', { data: { id_event: [id] } }).then((res) => {
                        this.onStart(true);
                        this.$toast.add({
                            severity: 'success', summary: 'Success',
                            detail: 'Data berhasil dihapus', life: 3000,
                        });
                    }).catch((err) => {
                        // error becuase of onDelete restrict from backend
                        this.$toast.add({
                            severity: 'error', summary: 'Error',
                            detail: 'Data gagal dihapus', life: 3000,
                        });
                        console.log(err);
                    });
                },
                reject: () => {
                    this.$toast.add({
                        severity: 'info', summary: 'Info',
                        detail: 'Data tidak dihapus', life: 3000,
                    });
                },
            });
        },
        multipleDeletionToggle(arg, event) {
            switch (arg) {
                case 'cancel':
                    this.selectionMode = false;
                    this.selectedItem = null;
                    this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Tidak ada item yang dihapus', life: 3000 });
                    break;
                case 'commit':
                    this.$confirm.require({
                        target: event.currentTarget,
                        icon: 'pi pi-exclamation-triangle',
                        acceptProps: { label: 'Ya', severity: 'success' },
                        rejectProps: { label: 'Tidak', severity: 'warning' },
                        group: window.innerWidth < 1024 ? 'dialog' : 'popup',
                        header: 'Konfirmasi Penghapusan',
                        message: 'Data yang dihapus tidak bisa dipulihkan',
                        accept: () => {
                            axios.delete('event', { data: { id_event: this.selectedItemId } }).then((res) => {
                                console.log(res);
                                this.onStart(true);
                                this.selectionMode = false;
                                this.selectedItem = null;
                                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil dihapus', life: 3000 });
                            }).catch((err) => {
                                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Data gagal dihapus', life: 3000 });
                                console.log(err);
                            });
                        },
                        reject: () => {
                            this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Data tidak dihapus', life: 3000 });
                        },
                    });
                    break;
                default:
                    this.selectionMode = !this.selectionMode;
                    this.selectedItem = null;
                    break;
            }
        },
        getLastFetchTime() {
            const lastFetches = JSON.parse(localStorage.getItem('lastFetches')) || {};
            // watch
            if (lastFetches.events) {
                const date = new Date(parseInt(lastFetches.events))
                const timeAgo = useTimeAgo(date);
                return timeAgo;
            } else {
                return 'Never';
            }
        },
        onSubmit() {
            this.buttonState.submit_loading = true;
            const fd = new FormData();

            fd.append('id_event', this.modalData.items.id_event);
            fd.append('judul', this.modalData.items.judul);

            if (this.modalData.newData) {
                fd.append('gambar', this.modalData.newData);
            }

            fd.append('penyelenggara', this.modalData.items.penyelenggara);
            fd.append('lokasi_event', this.modalData.items.lokasi_event);
            fd.append('tgl_event', this.modalData.items.tgl_event);
            fd.append('kuota', this.modalData.items.kuota);
            fd.append('konten', this.modalData.items.konten);
            fd.append('deskripsi', this.modalData.items.deskripsi);

            axios.post('event/edit', fd)
                .then((res) => {
                    this.onStart(true);
                    this.modal.editVisible = false;
                    this.$toast.add({ severity: 'success', summary: 'Terupload', detail: 'Data berita anda berhasil diupload', life: 3000 });
                    this.buttonState.submit_loading = false;
                })
                .catch((err) => {
                    this.$toast.add({ severity: 'error', summary: 'Gagal', detail: 'Data berita anda gagal diupload', life: 3000 });
                    console.log(err);
                    this.buttonState.submit_loading = false;
                })
        },
    },
    watch: {
        'size': {
            handler() {
                localStorage.setItem('appstate.size', JSON.stringify(this.appstate.size));
            },
            deep: true,
        },
    },
    async mounted() {
        await this.loadIndexedDB();
        this.onStart();
    },

};
</script>

<style scoped>
.category {
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
</style>
