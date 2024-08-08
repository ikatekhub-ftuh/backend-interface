<!-- 
TODO select location mungkin dikasih input biasa?
-->

<template>
    <div class="flex flex-col gap-5 main">
        <div class="flex flex-wrap justify-between">
            <div class="flex flex-wrap gap-4 max-md:flex-col max-md:w-full">
                <div>
                    <p class="mb-2 font-semibold text-xl">Nama Event</p>
                    <InputText v-model="event.title" placeholder="Judul Event"
                        v-tooltip.bottom="{ value: 'Masukkan judul event anda di sini', showDelay: 1000, hideDelay: 300 }" fluid/>
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Penyelenggara</p>
                    <InputText v-model="event.author" placeholder="Penyelenggara Event"
                        v-tooltip.bottom="{ value: 'Masukkan nama penyelenggara di sini', showDelay: 1000, hideDelay: 300 }" fluid/>
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Lokasi</p>
                    
                    <Select v-model="event.location" :options="items" filter optionLabel="name" placeholder="Kategori"
                        class="w-full md:w-56">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ slotProps.value }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div>{{ slotProps.option }}</div>
                        </template>
                    </Select>
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Tanggal Event</p>
                    <DatePicker v-model="event.start" :min-date="minDate" showIcon showButtonBar selectionMode="range" placeholder="Tanggal lahir"  :manualInput="false" fluid/>
                    <p class="info" v-if="event.start">Loker akan beredar {{ dayUntillPost }} hari lagi.</p>
                    <p class="info" v-if="event.start && dayUntillStop">Loker akan berhenti beredar setelah {{ dayUntillStop }} hari.</p>
                </div>
                <div>
                    <p class="mb-2 font-semibold text-xl">Kuota</p>
                    <InputNumber showButtons buttonLayout="horizontal" :min="1" v-model="event.max"
                        inputId="withoutgrouping" :useGrouping="false" :step="5" fluid>
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
            <p class="font-semibold text-xl">Logo </p>
            <sub-advpic v-model="event.thumbnail" />
        </div>
        <div>
            <p class="mb-2 font-semibold text-xl">Event</p>
            <div>
                <Editor v-model="event.editor" editorStyle="height: 400px" />
            </div>
        </div>
        <div class="flex items-center gap-2">
            <sub-yesnocomp @yes="onSubmit()" @no="onClear()" />
        </div>
        {{news}}
    </div>
</template>

<script>
    export default {
        name: 'News',
        data() {
            return {
                minDate: new Date(),
                items: [],
                dayUntillPost: 0,
                dayUntillStop: 0,
                event: {
                    editor: '',
                    title: '',
                    thumbnail: '',
                    author: 'Admin',
                    cat: '',
                    location: '',
                    start: '',
                    max: 100,
                },
                cat: [
                    "Olahraga",
                    "Pendidikan",
                    "Kesehatan",
                    "Teknologi",
                    "Bisnis",
                    "Hiburan",
                ]
            }
        },
        computed: {
            // 08/08/2024 - 08/23/2024
            dayUntillPost() {
                const date = new Date(this.event.start[0]);
                const now = new Date();
                const diffTime = Math.abs(date - now);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays;
            },
            dayUntillStop() {
                if (this.event.start[1] === null) return 0
                const date = new Date(this.event.start[1]);
                const now = new Date();
                const diffTime = Math.abs(date - now);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays;
            }
        },
        methods: {
            smallScreen() {
                return window.innerWidth < 1024;
            },
            onSubmit() {
                this.$toast.add({ severity: 'success', summary: 'Terupload', detail: 'Data event anda berhasil diupload', life: 3000 });
            },
            onClear() {
                this.$toast.add({ severity: 'success', summary: 'Dibersihkan', detail: 'Data event anda berhasil dibersihkan', life: 3000 });
                this.event = {
                    editor: '',
                    title: '',
                    thumbnail: '',
                    author: 'Admin',
                    cat: '',
                    max: 100,
                }
            },

            changeImg(img) {
                this.news.thumbnail = img;
            },

            getCity() {
                axios.get('https://staggingabsensi.labura.go.id/api-wilayah-indonesia/static/api/provinces.json').then((res) => {
                    this.items = res.data.map(item => item.name)
                    console.log(this.items)
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        mounted() {
            this.getCity()
        }
    }
</script>

<style scoped>
</style>
