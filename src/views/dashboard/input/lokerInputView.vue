<template>
    <main class="space-y-2">
        <div class="top-input-container">
            <div>
                <p class="input_label">Judul</p>
                <InputText v-model="items.judul" placeholder="Judul Loker" fluid />
            </div>
            <div>
                <p class="input_label">Lokasi</p>
                <InputText v-model="items.lokasi" placeholder="Judul Loker" fluid />
            </div>
            <div>
                <p class="input_label">Perusahaan</p>
                <Select v-model="items.id_perusahaan" :options="fetchdata.perusahaan" filter
                    optionLabel="nama_perusahaan" placeholder="Pilih perusahaan" fluid class="!min-w-[200px]" />
            </div>
            <div>
                <p class="input_label">Jenis Pekerjaan</p>
                <Select v-model="items.role" :options="options.role" filter placeholder="Pilih jenis perusahaan" fluid
                    class="!min-w-[200px]" />
            </div>
            <div>
                <p class="input_label">Pengalaman Kerja (Tahun)</p>
                <InputNumber showButtons buttonLayout="horizontal" v-model="items.pengalaman_kerja" :min="0" :max="99"
                    placeholder="Pengalaman Kerja" :step="1" fluid />
            </div>
            <div>
                <p class="input_label">Tanggal Selesai</p>
                <DatePicker v-model="items.tgl_selesai" :min-date="minDate" showIcon showButtonBar
                    placeholder="Durasi loker" :manualInput="false" fluid />
                <p class="info" v-if="items.tgl_selesai">Loker akan beredar selama {{ dayUntillStop }} hari.</p>
            </div>
        </div>
        <div>
            <p class="input_label">Deskripsi</p>
            <Textarea v-model="items.deskripsi" rows="5" cols="55" placeholder="Deskripsi Loker"
                class="max-md:w-full max-h-[200px] min-h-[100px]" />
        </div>
        <div>
            <p class="input_label">Konten</p>
            <div>
                <Editor v-model="items.konten" editorStyle="height: 400px" />
            </div>
        </div>
        <div class="center-v">
            <sub-confirm :isLoading="state._buttonLoading" :off="v$.items.$invalid" @no="clearForm"
                @yes="onConfirmSubmit" />
        </div>
    </main>
</template>
<script>
import InputNumber from 'primevue/inputnumber';

export default {
    data() {
        return {
            minDate: new Date(),
            v$: useVuelidate(),
            items: {
                judul: '',
                konten: '',
                deskripsi: '',
                lokasi: '',
                id_perusahaan: '',
                tgl_selesai: '',
                role: '',
                pengalaman_kerja: 0
            },
            clear: {},
            fetchdata: {},
            options: {
                role: [
                    "Paruh Waktu",
                    "Purna Waktu",
                    "Kontrak",
                    "Magang",
                    "Lainnya",
                ]
            },
            state: {
                _buttonLoading: false
            }
        }
    },
    validations() {
        return {
            items: {
                judul: { required },
                konten: { required },
                deskripsi: { required },
                lokasi: { required },
                id_perusahaan: { required },
                tgl_selesai: { required },
                role: { required },
                pengalaman_kerja: { required }
            }
        }
    },
    computed: {
        dayUntillStop() {
            const date = new Date(this.items.tgl_selesai);
            const now = new Date();
            const diffTime = Math.abs(date - now);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        },
    },
    methods: {
        async initialfetch() {
            try {
                const { data } = await axios.get('loker/perusahaan');
                this.fetchdata.perusahaan = data.data
            } catch (error) {
                uptoast(this.$toast, 'error', 'Gagal mengambil data');
            }
        },
        clearForm() {
            this.items = { ...this.clear };
            uptoast(this.$toast, 'info', 'Form telah direset');
        },
        async onConfirmSubmit() {
            // validate form
            this.v$.items.$touch();
            if (this.v$.items.$invalid) {
                uptoast(this.$toast, 'error', 'Form tidak valid');
                return;
            }

            // submit form
            this.state._buttonLoading = true;

            const fd = new FormData();
            this.items.id_perusahaan = this.items.id_perusahaan.id_perusahaan;
            this.items.tgl_selesai = new Date(this.items.tgl_selesai).toISOString();
            Object.keys(this.items).forEach(key => {
                fd.append(key, this.items[key]);
            });

            try {
                const response = await axios.post('loker', fd);
                uptoast(this.$toast).preset('success');
                this.clearForm();
            } catch (error) {
                uptoast(this.$toast).preset('error');
            } finally {
                this.state._buttonLoading = false;
            }
        }
    },
    async mounted() {
        this.clear = { ...this.items };
        this.v$.items.$touch(); //try removing this, if everythign works fine then you don't need this
        await this.initialfetch();
    }
};
</script>
<style scoped></style>
