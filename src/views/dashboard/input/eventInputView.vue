<template>
    <main class="space-y-2">
        <div>
            <div class="input_label">Gambar</div>
            <comp-imageUploader ref="uploader" @changeImg="changeImg" />
        </div>
        <div class="top-input-container">
            <div>
                <p class="input_label">Judul</p>
                <InputText v-model="items.judul" placeholder="Judul Event" fluid />
            </div>
            <div>
                <p class="input_label">Penyelenggara</p>
                <InputText v-model="items.penyelenggara" placeholder="Penyelenggara Event" fluid />
            </div>
            <div>
                <p class="input_label">Lokasi</p>
                <InputText v-model="items.lokasi_event" placeholder="Lokasi Event" fluid />
            </div>
            <div>
                <p class="input_label">Kuota Peserta Event</p>
                <InputNumber showButtons buttonLayout="horizontal" v-model="items.kuota" :min="1"
                    placeholder="Pengalaman Kerja" :step="25" fluid />
            </div>
            <div>
                <p class="input_label">Tanggal Event</p>
                <DatePicker v-model="items.tgl_event" :min-date="minDate" showIcon showButtonBar
                    placeholder="Tanggal mulai Event" :manualInput="false" fluid />
            </div>
        </div>
        <div>
            <p class="input_label">Deskripsi</p>
            <Textarea v-model="items.deskripsi" rows="5" cols="55" placeholder="Deskripsi Event"
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


export default {
    data() {
        return {
            minDate: new Date(),
            v$: useVuelidate(),
            items: {
                judul: '',
                gambar: '',
                penyelenggara: '',
                konten: '',
                deskripsi: '',
                tgl_event: '',
                lokasi_event: '',
                kuota: 100
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
                gambar: { required },
                penyelenggara: { required },
                konten: { required },
                deskripsi: { required },
                tgl_event: { required },
                lokasi_event: { required },
                kuota: { required }
            }
        }
    },
    computed: {
    },
    methods: {
        clearForm() {
            this.items = { ...this.clear };
            this.$refs.uploader.$refs.fileUpload.clear();
            uptoast(this.$toast, 'info', 'Form telah direset');
        },
        changeImg(img) {
            this.items.gambar = img;
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
            const headers = {
                'Content-Type': 'multipart/form-data'
            }

            this.items.tgl_event = new Date(this.items.tgl_event).toISOString();
            Object.keys(this.items).forEach(key => {
                fd.append(key, this.items[key]);
            });
            console.log(fd);

            try {
                const response = await axios.post('event', fd, { headers });
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
    }
};
</script>
<style scoped></style>
