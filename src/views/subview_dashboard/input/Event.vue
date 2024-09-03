<!--
TODO date nya bikin range (start - end)
-->

<template>
    <div class="flex flex-col gap-5 main">
        <div class="flex flex-wrap justify-between">
            <div class="flex max-md:flex-col max-md:w-full flex-wrap gap-4">
                <div>
                    <p class="mb-2 font-semibold text-xl">Nama Event</p>
                    <InputText v-model="event.title" placeholder="Judul Event"
                        v-tooltip.bottom="{ value: 'Masukkan judul event anda di sini', showDelay: 1000, hideDelay: 300 }"
                        fluid />
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Penyelenggara</p>
                    <InputText v-model="event.author" placeholder="Penyelenggara Event"
                        v-tooltip.bottom="{ value: 'Masukkan nama penyelenggara di sini', showDelay: 1000, hideDelay: 300 }"
                        fluid />
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Lokasi</p>
                    <InputText v-model="event.location" placeholder="Lokasi Event"
                        v-tooltip.bottom="{ value: 'Masukkan nama lokasi event di sini', showDelay: 1000, hideDelay: 300 }"
                        fluid />
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Tanggal Event</p>
                    <DatePicker v-model="event.start" :min-date="minDate" placeholder="Tanggal Event" showIcon fluid />
                    <p class="info" v-if="event.start">Even akan dimulai {{ dayUntillEvent }} hari lagi.</p>
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Kuota</p>
                    <InputNumber showButtons buttonLayout="horizontal" :min="1" v-model="event.max"
                        inputId="withoutgrouping" :useGrouping="false" :step="25" fluid>
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
                </div>
            </div>
        </div>
        <div>
            <p class="font-semibold text-xl">Thumbnail</p>
            <sub-advpic ref="AdvPic" @changeImg="changeImg" />
        </div>
        <div>
            <p class="mb-2 font-semibold text-xl">Deskripsi</p>
            <Textarea v-model="event.desc" rows="5" cols="30" placeholder="Deskripsi event"
                v-tooltip.bottom="{ value: 'Masukkan deskripsi event anda di sini', showDelay: 1000, hideDelay: 300 }"
                fluid />
        </div>
        <div>
            <p class="mb-2 font-semibold text-xl">Event</p>
            <div>
                <Editor v-model="event.editor" editorStyle="height: 400px" />
            </div>
        </div>
        <div class="flex items-center gap-2">
            <sub-yesnocomp :off="computedVerification" :submitloading="buttonState.submit_loading" @yes="onSubmit()"
                @no="onClear()" />
        </div>
        {{ event }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            buttonState: {
                submit_loading: false,
            },
            minDate: new Date(),
            event: {
                editor: '',
                title: '',
                thumbnail: null,
                author: 'Admin ANTEK HUB',
                location: '',
                start: '',
                max: 1000,
                desc: '',
            },
        }
    },
    computed: {
        dayUntillEvent() {
            const date = new Date(this.event.start);
            const now = new Date();
            const diffTime = Math.abs(date - now);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        },
        computedVerification() {
            return Object.values(this.event).some((val) => val === null || val === undefined || val === '' || val === [] || val === {});
        }
    },
    methods: {
        smallScreen() {
            return window.innerWidth < 1024;
        },
        onSubmit() {
            this.buttonState.submit_loading = true;

            const fd = new FormData();
            fd.append('judul', this.event.title);
            fd.append('gambar', this.event.thumbnail);
            fd.append('penyelenggara', this.event.author);
            fd.append('lokasi_event', this.event.location);
            fd.append('tgl_event', this.event.start.toISOString().split('T')[0]);
            fd.append('kuota', this.event.max);
            fd.append('konten', this.event.editor);
            fd.append('deskripsi', this.event.desc);

            axios.post('event', fd)
                .then((res) => {
                    this.$refs.AdvPic.$refs.fileUpload.clear();
                    this.buttonState.submit_loading = false;
                    this.onClear();
                    this.$toast.add({ severity: 'success', summary: 'Terupload', detail: 'Data event anda berhasil diupload', life: 3000 });
                })
                .catch((err) => {
                    this.$toast.add({ severity: 'error', summary: 'Gagal', detail: 'Event gagal ditambahkan', life: 3000 });
                    this.buttonState.submit_loading = false;
                })
        },
        changeImg(img) {
            this.event.thumbnail = img;
            console.log(this.event.thumbnail);
        },
        onClear() {
            this.event = {
                editor: '',
                title: '',
                thumbnail: '',
                author: 'Admin ANTEK HUB',
                cat: '',
                max: 100,
            }
            this.$toast.add({ severity: 'success', summary: 'Dibersihkan', detail: 'Data event anda berhasil dibersihkan', life: 3000 });
        }
    }
}
</script>

<style scoped></style>
