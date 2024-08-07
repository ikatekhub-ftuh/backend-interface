<!-- 
TODO singkronkan validasi input(maxfilesize) dengan backend

FIXME thumbnail doesnt reach v-model
-->

<template>
    <div class="flex flex-col gap-5 main">
        <div class="flex flex-wrap justify-between">
            <div class="flex flex-wrap gap-4">
                <div>
                    <p class="mb-2 font-semibold text-xl">Judul</p>
                    <InputText v-model="news.title" placeholder="Judul Berita"
                        v-tooltip.bottom="{ value: 'Masukkan judul berita anda di sini', showDelay: 1000, hideDelay: 300 }" />
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Penulis</p>
                    <InputText v-model="news.author"
                        v-tooltip.bottom="{ value: 'Masukkan nama penulis berita anda di sini', showDelay: 1000, hideDelay: 300 }" />
                </div>
            </div>
            <div class="flex items-center gap-2">
                <Button label="Submit" @click="onSubmit($event)" severity="success" />
                <Button label="Clear" @click="onClear($event)" severity="danger" />
            </div>
        </div>
        <div>
            <p class="font-semibold text-xl">Thumbnail</p>
            <FileUpload name="thumbnail" v-model="news.thumbnail" url="/api/upload" :multiple="false" accept="image/*"
                :fileLimit="1" :maxFileSize="2000000">
                <template #header="{ chooseCallback, clearCallback, files }">
                    <div class="flex flex-wrap flex-1 justify-between items-center gap-4">
                        <div class="flex gap-2">
                            <Button :disabled="files.length !== 0" @click="chooseCallback()" outlined
                                severity="secondary"><span class="pi pi-images" />Pilih</Button>
                            <Button @click="clearCallback()" outlined severity="danger"
                                :disabled="!files || files.length === 0"><span class="pi pi-images" />Cancel</Button>
                        </div>
                        <!-- file size -->
                        <div class="whitespace-nowrap">{{files.length !== 0 ? files[0].name + ' - ' + (files[0].size /
                            2000).toFixed(2) + 'KB / 2Mb' : '0KB / 2Mb'}}</div>
                    </div>
                </template>
                <template #empty>
                    <p class="max-lg:hidden py-5">Drag and drop atau pilih file untuk mengubah thumbnail.</p>
                    <p class="lg:hidden py-5">Pilih file untuk mengubah thumbnail.</p>
                </template>
            </FileUpload>
        </div>
        <div>
            <p class="mb-2 font-semibold text-xl">Artikel</p>
            <div>
                <Editor v-model="news.editor" editorStyle="height: 400px" class="h-full" />
            </div>
        </div>
        <!-- <div class="flex items-center gap-2 lg:hidden">
            <Button label="Submit" @click="onSubmit($event)" severity="success" />
            <Button label="Clear" @click="onClear($event)" severity="danger" />
        </div> -->
        {{news}}
    </div>
</template>

<script>
    export default {
        name: 'News',
        data() {
            return {
                news: {
                    editor: '',
                    title: '',
                    thumbnail: '',
                    author: '',
                }
            }
        },
        methods: {
            screenCheck() {
                return window.innerWidth < 1024;
            },
            onSubmit(event) {
                this.$confirm.require({
                    target: event.currentTarget,
                    message: 'Yakin ingin submit data?',
                    icon: 'pi pi-save',
                    rejectProps: {
                        label: 'Batal',
                        severity: 'secondary',
                        outlined: true
                    },
                    acceptProps: {
                        label: 'Submit',
                        severity: 'success',
                    },
                    accept: () => {
                        // detail itu nanti diganti sama response.data.message
                        this.$toast.add({ severity: 'success', summary: 'Terupload', detail: 'Data berita anda berhasil diupload', life: 3000 });
                    },
                    reject: () => {
                        this.$toast.add({ severity: 'error', summary: 'Batal', detail: 'Proses dibatalkan, data tidak diupload', life: 3000 });
                    }
                });
            },
            onClear(event) {
                this.$confirm.require({
                    target: event.currentTarget,
                    message: 'Yakin ingin submit data?',
                    icon: 'pi pi-save',
                    rejectProps: {
                        label: 'Batal',
                        severity: 'secondary',
                        outlined: true
                    },
                    acceptProps: {
                        label: 'Submit',
                        severity: 'success',
                    },
                    accept: () => {
                        // detail itu nanti diganti sama response.data.message
                        this.$toast.add({ severity: 'success', summary: 'Terupload', detail: 'Data berita anda berhasil diupload', life: 3000 });
                    },
                    reject: () => {
                        this.$toast.add({ severity: 'error', summary: 'Batal', detail: 'Proses dibatalkan, data tidak diupload', life: 3000 });
                    }
                });
                this.news = {
                    editor: '',
                    title: '',
                    thumbnail: '',
                    author: '',
                }
            }
        }
    }
</script>

<style scoped>
</style>
