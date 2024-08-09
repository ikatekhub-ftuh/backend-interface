<!-- 
TODO singkronkan validasi input(maxfilesize) dengan backend

FIXME thumbnail doesnt reach v-model
-->

<template>
    <div class="flex flex-col gap-5 main">
        <div class="flex flex-wrap justify-between">
            <div class="flex flex-wrap max-md:flex-col max-md:w-full gap-4">
                <div>
                    <p class="mb-2 font-semibold text-xl">Judul</p>
                    <InputText v-model="news.title" placeholder="Judul Berita"
                        v-tooltip.bottom="{ value: 'Masukkan judul berita anda di sini', showDelay: 1000, hideDelay: 300 }"
                        fluid />
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Penulis</p>
                    <InputText v-model="news.author" placeholder="Penulis Berita"
                        v-tooltip.bottom="{ value: 'Masukkan nama penulis berita anda di sini', showDelay: 1000, hideDelay: 300 }"
                        fluid />
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Kategori</p>
                    <Select v-model="news.cat" :options="cat" filter optionLabel="kategori" placeholder="Kategori"
                        class="w-full md:w-56">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value.kategori }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex justify-between gap-2">{{ slotProps.option.kategori }}</div>
                        </template>
                    </Select>
                </div>
            </div>
        </div>
        <div>
            <p class="font-semibold text-xl">Thumbnail</p>
            <sub-advpic ref="AdvPic" @changeImg="changeImg" />
        </div>
        <div>
            <p class="mb-2 font-semibold text-xl">Artikel</p>
            <div>
                <Editor v-model="news.editor" editorStyle="height: 400px" />
            </div>
        </div>
        <div class="flex items-center gap-2 ">
            <sub-yesnocomp :submitloading="buttonState.submit_loading" @yes="onSubmit()" @no="onClear()" />
        </div>
        <div class="text-wrap max-w-full">
            {{news}}
            {{news.cat.id_kategori_berita}}
            {{ cat }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'News',
        data() {
            return {
                buttonState: {
                    submit_loading: false,
                },
                news: {
                    editor: '',
                    title: '',
                    thumbnail: null,
                    author: 'Admin',
                    cat: '',
                },
                cat: [
                ]
            }
        },
        methods: {
            onSubmit() {
                this.buttonState.submit_loading = true;

                const fd = new FormData();
                fd.append('gambar', this.news.thumbnail);
                fd.append('judul', this.news.title);
                fd.append('penulis', this.news.author);
                fd.append('id_kategori_berita', this.news.cat.id_kategori_berita);
                fd.append('konten', this.news.editor);

                axios.post('berita', fd)
                    .then((res) => {
                        this.$refs.AdvPic.$refs.fileUpload.clear();
                        this.onClear();
                        this.$toast.add({ severity: 'success', summary: 'Terupload', detail: 'Data berita anda berhasil diupload', life: 3000 });
                        this.buttonState.submit_loading = false;
                    })
                    .catch((err) => {
                        this.$toast.add({ severity: 'error', summary: 'Gagal', detail: 'Data berita anda gagal diupload', life: 3000 });
                        this.buttonState.submit_loading = false;
                    })
            },
            onClear() {
                this.$toast.add({ severity: 'info', summary: 'Dibersihkan', detail: 'Data berita anda berhasil dibersihkan', life: 3000 });
                this.news = {
                    editor: '',
                    title: '',
                    thumbnail: null,
                    author: 'Admin',
                    cat: '',
                }
            },
            changeImg(img) {
                this.news.thumbnail = img;
                console.log(this.news.thumbnail);
            },
            
            fetchCat() {
                axios.get('berita/kategori')
                    .then((res) => {
                        this.cat = res.data.data;
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        },
        mounted() {
            this.fetchCat();
        }
    }
</script>

<style scoped>
</style>
