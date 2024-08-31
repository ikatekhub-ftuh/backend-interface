<!--
TODO select location mungkin dikasih input biasa?
-->

<template>
    <div class="flex flex-col gap-5 main">
        <div class="flex flex-wrap justify-between">
            <div class="flex flex-wrap gap-4 max-md:flex-col max-md:w-full">
                <div>
                    <p class="mb-2 font-semibold text-xl">Posisi</p>
                    <InputText v-model="loker.title" placeholder="Nama posisi"
                        v-tooltip.bottom="{ value: 'Masukkan nama posisi anda di sini', showDelay: 1000, hideDelay: 300 }"
                        fluid />
                </div>
                {{ loker.company }}
                <div>
                    <p class="mb-2 font-semibold text-xl">Perusahaan</p>
                    <Select v-model="loker.company" filter optionLabel="nama_perusahaan" :options="company"
                        placeholder="Nama perusahaan" class="w-full md:w-56">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value.nama_perusahaan }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex justify-between gap-2">{{ slotProps.option.nama_perusahaan }}</div>
                        </template>
                    </Select>
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Lokasi</p>
                    <InputText v-model="loker.location" placeholder="Lokasi perusahaan"
                        v-tooltip.bottom="{ value: 'Masukkan lokasi perusahaan di sini', showDelay: 1000, hideDelay: 300 }"
                        fluid />
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Tanggal selesai</p>
                    <DatePicker v-model="loker.end" :min-date="minDate" showIcon showButtonBar
                        placeholder="Durasi loker" :manualInput="false" fluid />
                    <p class="info" v-if="loker.end">Loker akan beredar selama {{ dayUntillStop }} hari.</p>
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Pengalaman</p>
                    <InputNumber showButtons buttonLayout="horizontal" :min="0" :max="99" v-model="loker.experience"
                        inputId="withoutgrouping" :useGrouping="false" :step="1" fluid>
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Jenis Pekerjaan</p>
                    <Select v-model="loker.role" :options="options" placeholder="Kategori" class="w-full md:w-56">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex justify-between gap-2">{{ slotProps.option }}</div>
                        </template>
                    </Select>
                    <p v-if="loker.role === 'Lainnya'" class="info">Jelaskan di deskripsi lowongan kerja.</p>
                </div>
            </div>
        </div>
        <div>
            <p class="mb-2 font-semibold text-xl">Jelaskan Lowongan Kerja Anda</p>
            <div>
                <Editor v-model="loker.editor" editorStyle="height: 400px" />
            </div>
        </div>
        <div class="flex items-center gap-2">
            <sub-yesnocomp :submitLoading="buttonState.submit_loading" @yes="onSubmit()" @no="onClear()" />
        </div>
        {{ loker }}
    </div>
</template>

<script>
export default {
    name: 'Loker',
    data() {
        return {
            minDate: new Date(),
            buttonState: {
                submit_loading: false,
            },
            loker: {
                editor: '',
                title: '',
                company: '',
                location: '',
                end: null,
                experience: 0,
                role: 'Paruh Waktu',
            },
            options: [
                "Paruh Waktu",
                "Purna Waktu",
                "Kontrak",
                "Magang",
                "Lainnya",
            ],
            company: [],
        }
    },
    computed: {
        dayUntillStop() {
            const date = new Date(this.loker.end);
            const now = new Date();
            const diffTime = Math.abs(date - now);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        },
    },
    methods: {
        smallScreen() {
            return window.innerWidth < 1024;
        },
        onSubmit() {
            this.buttonState.submit_loading = true;

            const fd = new FormData();
            fd.append('judul', this.loker.title);
            fd.append('id_perusahaan', this.loker.company.id_perusahaan);
            fd.append('lokasi', this.loker.location);
            fd.append('pengalaman_kerja', this.loker.experience);
            fd.append('konten', this.loker.editor);
            fd.append('tgl_selesai', this.loker.end.toISOString().split('T')[0]);
            fd.append('role', this.loker.role);

            axios.post('loker', fd)
                .then((res) => {
                    this.$toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Data loker anda berhasil ditambahkan', life: 3000 });
                    this.onClear();
                })
                .catch((err) => {
                    this.$toast.add({ severity: 'error', summary: 'Gagal', detail: 'Data loker anda gagal ditambahkan', life: 3000 });
                })
                .finally(() => {
                    this.buttonState.submit_loading = false;
                });

            this.buttonState.submit_loading = false;
        },
        onClear() {
            this.$toast.add({ severity: 'success', summary: 'Dibersihkan', detail: 'Data loker anda berhasil dibersihkan', life: 3000 });
            this.loker = {
                editor: '',
                title: '',
                author: 'Admin ANTEK HUB',
                cat: '',
                max: 100,
            }
        },
        fetchCompany() {
            axios.get('loker/company')
                .then((res) => {
                    this.company = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    },
    mounted() {
        this.fetchCompany();
    }
}
</script>

<style scoped></style>
