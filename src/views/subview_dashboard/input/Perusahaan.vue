<!-- *DONE* -->

<template>
    <div class="flex flex-col gap-5 main">
        <div class="flex flex-wrap justify-between">
            <div class="flex flex-wrap max-md:flex-col max-md:w-full gap-4">
                <div>
                    <p class="mb-2 font-semibold text-xl">Nama</p>
                    <InputText v-model="company.name" placeholder="Nama Perusahaan"
                        v-tooltip.bottom="{ value: 'Masukkan judul berita anda di sini', showDelay: 1000, hideDelay: 300 }"
                        fluid />
                </div>
            </div>
        </div>
        <div>
            <p class="font-semibold text-xl">Thumbnail</p>
            <sub-advpic ref="AdvPic" @changeImg="changeImg" />
        </div>
        <div class="flex items-center gap-2 ">
            <sub-yesnocomp :off="computedVerification" :submitloading="buttonState.submit_loading" @yes="onSubmit()"
                @no="onClear()" />
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
            company: {
                name: '',
                thumbnail: null,
            },
        }
    },
    computed: {
        computedVerification() {
            return Object.values(this.company).some((val) => val === null || val === undefined || val === '' || val === [] || val === {});
        }
    },
    methods: {
        onSubmit() {
            this.buttonState.submit_loading = true;

            const fd = new FormData();
            fd.append('nama_perusahaan', this.company.name);
            fd.append('logo', this.company.thumbnail);

            axios.post('loker/perusahaan', fd)
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
            this.company = {
                name: '',
                thumbnail: null,
            }
            this.$toast.add({ severity: 'info', summary: 'Dibersihkan', detail: 'Data berita anda berhasil dibersihkan', life: 3000 });
        },
        changeImg(img) {
            this.company.thumbnail = img;
            console.log(this.company.thumbnail);
        }
    },
}
</script>

<style scoped></style>
