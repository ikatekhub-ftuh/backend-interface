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
        <DataTable removableSort v-model:filters="filters" v-model:selection="selectedProduct" :value="news" paginator
            :rows="10" :rowsPerPageOptions="[5, 10, 15]" :size="size.value" dataKey="id_berita"
            :globalFilterFields="['judul', 'penulis', 'kategori.kategori']">
            <!-- paginator  -->
            <template #header>
                <div class="flex justify-between">
                    <SelectButton v-model="size" size="small" :options="sizeOptions" optionLabel="label"
                        dataKey="label" />
                    <div class="flex flex-row gap-1 justify-center items-center">
                        <Button :size="size.value" class="h-full" @click="toggleSelection()"
                            :severity="selectionMode ? 'danger' : 'secondary'">
                            <span class="pi pi-trash"></span>
                        </Button>
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
            <Column field="id_berita" sortable header="ID"></Column>
            <Column field="judul" sortable header="Judul"></Column>
            <Column field="penulis" sortable header="Penulis"></Column>
            <Column field="total_like" sortable header="Like">
                <template #body="slotProps">
                    <span class="pi pi-thumbs-up mr-2"></span>
                    <span class="text-ellipsis text-nowrap"> {{ slotProps.data.total_like }} </span>
                </template>
            </Column>
            <Column field="kategori.kategori" sortable header="Kategori">
                <template #body="slotProps">
                    <span class="category text-ellipsis text-nowrap"> {{ slotProps.data.kategori.kategori }} </span>
                </template>
            </Column>
            <Column sortable header="Action">
                <template #body="slotProps">
                    <div class="flex flex-row gap-1">
                        <Button :size="size.value" @click="openSlug('delete', slotProps.data.id_berita)"
                            severity="danger">
                            <span class="pi pi-trash"></span>
                        </Button>
                        <Button :size="size.value" @click="openSlug('view', slotProps.data.id_berita)" severity="info">
                            <span class="pi pi-eye"></span>
                        </Button>
                        <Button :size="size.value" @click="openSlug('edit', slotProps.data.id_berita)" severity="warn">
                            <span class="pi pi-pencil"></span>
                        </Button>
                    </div>
                </template>
            </Column>
            <template #paginatorstart>
                <!-- <Button type="button" icon="pi pi-refresh" text @click="onStart(true)" /> -->
            </template>
            <template #paginatorend>
                <!-- <Button type="button" icon="pi pi-download" text /> -->
            </template>
        </DataTable>

    </div>
    <Dialog v-if="modalData.news" v-model:visible="modal.viewVisible" modal maximizable :header="modalData.header"
        @hide="() => { modalData = {} }" :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '80vw', '575px': '100vw' }">
        <div class="fluid *:mb-2">
            <div>
                <Image :src="this.default.image + modalData.news.gambar" :alt="`image of ${modalData.news.judul}`"
                    class="w-full h-auto max-h-[300px]" preview />
            </div>
            <div>
                <Tag :value="modalData.news.kategori.kategori" severity="info" />
            </div>
            <div>
                <h2 class="font-semibold text-2xl">{{ modalData.news.judul }}</h2>
            </div>
            <div>
                <span class="font-medium">By {{ modalData.news.penulis }}</span>
            </div>
            <div>
                <span class="pi pi-thumbs-up mr-2"></span>{{ modalData.news.total_like }} Likes
            </div>
            <div>
                <span class="pi pi-calendar mr-2"></span>{{ formattedDate(modalData.news.created_at) }}
            </div>
            <Panel header="Deskripsi" toggleable>
                <div class="prose max-w-max overflow-y-scroll max-h-[400px]" v-html="modalData.news.deskripsi"></div>
            </Panel>
            <Panel header="Konten" toggleable>
                <div class="prose max-w-max overflow-y-scroll max-h-[700px]" v-html="modalData.news.konten"></div>
            </Panel>
        </div>
    </Dialog>
</template>

<script>
import { FilterMatchMode } from '@primevue/core/api';

export default {
    inject: ['default'],
    data() {
        const KEY = 'news';
        const stateObject = useIDBKeyval(`${KEY}-object`, {
            data: [],
        });

        const localState = ref(stateObject);

        watch(localState, (newValue) => {
            stateObject.value = newValue;
        }, { deep: true });

        return {
            localState,
            selectionMode: false,
            news: [
            ],
            size: { label: 'Normal', value: 'null' },
            sizeOptions: [
                { label: 'Small', value: 'small' },
                { label: 'Normal', value: 'null' },
                { label: 'Large', value: 'large' }
            ],
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            },
            selectedProduct: null,
            cacheDuration: 360000,
            cached: false,
            modal: {
                viewVisible: false,
            },
            modalData: {
            },
        };
    },
    computed: {
        formattedDate() {
            return (dateString) => {
                const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                return new Date(dateString).toLocaleDateString('id-ID', options);
            };
        },
    },
    methods: {
        debug() {
            console.log(this.localState.data)
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
        async onStart(force = false) {
            const now = new Date().getTime();

            const lastFetches = JSON.parse(localStorage.getItem('lastFetches')) || {};
            const cachednews = JSON.stringify(this.localState.data.data);

            if (lastFetches.news && cachednews && (now - lastFetches.news < this.cacheDuration) && !force) {
                this.news = JSON.parse(cachednews);
                this.cached = true;
                return;
            }

            axios.get('http://127.0.0.1:8000/api/berita?all').then((res) => {
                this.news = res.data.data.data
                lastFetches.news = now;
                localStorage.setItem('lastFetches', JSON.stringify(lastFetches));
                this.localState.data.data = this.news;

                this.cached = false;
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });
            }).catch((err) => {
                console.log(err);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
            })
        },
        openSlug(context, id) {
            switch (context) {
                case 'view':
                    axios.get('berita/id/' + id)
                        .then((res) => {
                            this.modalData.news = res.data.data;
                            this.modalData.header = 'View News';
                            this.modal.viewVisible = true;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    break;
                default:
                    break;
            }
        },
        toggleSelection() {
            this.selectionMode = !this.selectionMode;
            this.selectedProduct = null;

            if (!this.selectionMode && !this.toastCooldown) {
                this.$toast.add({
                    severity: 'info', summary: 'Cleared',
                    detail: 'Selected news cleared', life: 3000
                });

                if (!this.selectedProduct) {
                    this.$toast.add({
                        severity: 'info', summary: 'No Selection',
                        detail: 'No product Deleted', life: 3000
                    });
                }

                this.toastCooldown = true; // Set toast cooldown flag
                setTimeout(() => {
                    this.toastCooldown = false; // Reset toast cooldown flag after 3 seconds
                }, 3000);
            }
        },
        getLastFetchTime() {
            const lastFetches = JSON.parse(localStorage.getItem('lastFetches')) || {};
            if (lastFetches.news) {
                const date = new Date(parseInt(lastFetches.news))
                    .toLocaleString('id-ID');
                const diff = new Date().getTime() - lastFetches.news;

                if (diff < 60000) {
                    return `${date} (${Math.floor(diff / 1000)} detik yang lalu)`;
                } else if (diff < 3600000) {
                    return `${date} (${Math.floor(diff / 60000)} menit yang lalu)`;
                } else if (diff < 86400000) {
                    return `${date} (${Math.floor(diff / 3600000)} jam yang lalu)`;
                } else {
                    return `${date} (${Math.floor(diff / 86400000)} hari yang lalu)`;
                }
            } else {
                return 'Never';
            }
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
