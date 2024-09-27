<template>
    <main class="space-y-2">
        <div>
            <div class="input_label">Gambar</div>
            <comp-imageUploader ref="uploader" @changeImg="changeImg" />
        </div>
        <div class="top-input-container">
            <div>
                <p class="input_label">Judul</p>
                <InputText v-model="items.judul" placeholder="Judul Berita" fluid />
            </div>
            <div>
                <p class="input_label">Penulis</p>
                <InputText v-model="items.penulis" placeholder="Penulis Berita" fluid />
            </div>
            <div>
                <p class="input_label">Kategori</p>
                <Select v-model="items.id_kategori_berita" :options="fetchdata.kategori" filter optionLabel="kategori"
                    placeholder="Kategori Berita" fluid class="!min-w-[200px]" />
            </div>
        </div>
        <div>
            <p class="input_label">Deskripsi</p>
            <Textarea v-model="items.deskripsi" rows="5" cols="55" placeholder="Deskripsi berita"
                class="max-md:w-full" />
        </div>
        <div>
            <p class="input_label">Artikel</p>
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
    name: 'beritaInput',
    data() {
        return {
            v$: useVuelidate(),
            items: {
                konten: '',
                judul: '',
                gambar: null,
                penulis: 'Admin ANTEK HUB',
                id_kategori_berita: '',
                deskripsi: ''
            },
            clear: {},
            fetchdata: {
                kategori: []
            },
            state: {
                _buttonLoading: false
            }
        }
    },
    validations() {
        return {
            items: {
                konten: { required },
                judul: { required },
                gambar: { required },
                penulis: { required },
                id_kategori_berita: { required },
                deskripsi: { required }
            }
        }
    },
    methods: {
        async initialfetch() {
            try {
                const { data } = await axios.get('/berita/kategori');
                this.fetchdata.kategori = data.data
                uptoast(this.$toast, 'success', 'Berhasil mengambil data kategori');
            } catch (error) {
                uptoast(this.$toast, 'error', 'Gagal mengambil data kategori');
            }
        },
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
            };
            this.items.id_kategori_berita = this.items.id_kategori_berita.id_kategori_berita;
            Object.keys(this.items).forEach(key => {
                fd.append(key, this.items[key]);
            });

            try {
                const response = await axios.post('/berita', fd, { headers });
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
