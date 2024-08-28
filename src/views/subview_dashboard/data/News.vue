<template>
    <div class="flex flex-col gap-5 main">
        <Message severity="info" icon="pi pi-send" v-if="cached">
            Menggunakan data cache.
            <span class="link" @click="onStart(true)">Refresh</span>
        </Message>
        <DataTable v-model:filters="filters" v-model:selection="selectedProduct" :value="products" paginator :rows="10"
            stripedRows :rowsPerPageOptions="[5, 10, 15]" :size="size.value" dataKey="id_berita"
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
            <Column field="id_berita" header="ID"></Column>
            <Column field="judul" header="Judul"></Column>
            <Column field="penulis" header="Penulis"></Column>
            <Column field="kategori.kategori" header="Kategori">
                <template #body="slotProps">
                    <span class="category text-ellipsis text-nowrap"> {{ slotProps.data.kategori.kategori }} </span>
                </template>
            </Column>
            <Column header="Action">
                <template #body="slotProps">
                    <div class="flex flex-row gap-1">
                        <Button :size="size.value" @click="openSlug(slotProps.data.slug)" severity="danger">
                            <span class="pi pi-trash"></span>
                        </Button>
                        <Button :size="size.value" @click="openSlug(slotProps.data.slug)" severity="info">
                            <span class="pi pi-eye"></span>
                        </Button>
                        <Button :size="size.value" @click="openSlug(slotProps.data.slug)" severity="warn">
                            <span class="pi pi-eye"></span>
                        </Button>
                    </div>
                </template>
            </Column>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text @click="onStart(true)" />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-download" text />
            </template>
        </DataTable>

    </div>
</template>

<script>
import { FilterMatchMode } from '@primevue/core/api';
export default {
    data() {
        return {
            selectionMode: false,
            products: [
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
            cacheDuration: 60000,
            cached: false
        };
    },
    methods: {
        hideMySelf(event) {
            event.target.style.display = 'none';
        },
        onStart(force = false) {
            const now = new Date().getTime();
            const lastFetchTime = localStorage.getItem('lastFetchTime');
            const cachedProducts = localStorage.getItem('products');

            if (lastFetchTime && cachedProducts && (now - lastFetchTime < this.cacheDuration) && !force) {
                this.products = JSON.parse(cachedProducts);
                this.cached = true;
                return;
            }

            axios.get('http://127.0.0.1:8000/api/berita?all').then((res) => {
                this.products = res.data.data.data
                localStorage.setItem('products', JSON.stringify(this.products));
                localStorage.setItem('lastFetchTime', now);
                this.cached = false;
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });
            }).catch((err) => {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
            })
        },
        openSlug(x) {
            alert(x)
        },
        toggleSelection() {
            this.selectionMode = !this.selectionMode;
            this.selectedProduct = null;

            if (!this.selectionMode && !this.toastCooldown) {
                this.$toast.add({
                    severity: 'info', summary: 'Cleared',
                    detail: 'Selected products cleared', life: 3000
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
    },
    mounted() {
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
}
</style>
