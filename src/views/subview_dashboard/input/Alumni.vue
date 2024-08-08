<!-- TODO qrcode  -->

<template>
    <div class="flex max-lg:flex-col">
        <div class="flex flex-col flex-wrap gap-4 w-full lg:w-fit">
            <!-- pfp -->
            <sub-smppic @changedImg="handleInput"></sub-smppic>
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-user"></i>
                </InputGroupAddon>
                <InputText v-model="form.nama" placeholder="Nama Lengkap" />
            </InputGroup>

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-id-card"></i>
                </InputGroupAddon>
                <InputText v-model="form.stambuk" placeholder="Stambuk" />
            </InputGroup>
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-calendar"></i>
                </InputGroupAddon>
                <DatePicker v-model="form.tanggal_lahir" placeholder="Tanggal lahir" showIcon fluid />
            </InputGroup>
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-book"></i>
                </InputGroupAddon>
                <Select v-model="form.jurusan" :options="option.jurusan" filter optionLabel="name" placeholder="Jurusan"
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
            </InputGroup>
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-address-book"></i>
                </InputGroupAddon>
                <Select v-model="form.angkatan" :options="option.angkatan" filter optionLabel="name"
                    placeholder="Angkatan" class="w-full md:w-56">
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
            </InputGroup>
            <InputGroup>
                <InputGroupAddon>
                    <!-- here -->
                    <i class="pi pi-plus"></i>
                </InputGroupAddon>
                <Select v-model="form.goldar" :options="option.goldar" optionLabel="name" placeholder="Golongan Darah"
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
            </InputGroup>
            <div class="w-full max-lg:flex justify-center items-center">
                <SelectButton v-model="form.gender" :options="option.gender" />
            </div>
            <div class="flex items-center gap-2">
                <sub-yesnocomp @yes="yesno('yes')" @no="yesno('no')"></sub-yesnocomp>
            </div>
            <qrcode :value="form.stambuk"></qrcode>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                preview: {
                    qrimg: null,
                },
                form: {
                    nama: "",
                    gender: "Laki-laki",
                    angkatan: "",
                    jurusan: "",
                    goldar: "",
                    stambuk: "",
                    tanggal_lahir: "",
                    pfp: null,
                },
                option: {
                    gender: ["Laki-laki", "Perempuan"],
                    jurusan: [
                        "Teknik Informatika",
                        "Teknik Elektro",
                        "Teknik Mesin",
                        "Teknik Sipil",
                        "Teknik Kimia",
                        "Teknik Industri",
                    ],
                    angkatan: [
                        "2017",
                        "2018",
                        "2019",
                        "2020",
                        "2021",
                        "2022",
                        "2023",
                        "2024",
                        "2025",
                    ],
                    goldar: ["A", "B", "AB", "O"],
                }
            }
        },
        methods: {
            handleInput(x) {
                this.form.pfp = x;
                const reader = new FileReader();
            },
            yesno(x) {
                if (x === "yes") {
                    console.log(this.form);
                } else {
                    this.form = {
                        nama: "",
                        gender: "Laki-laki",
                        angkatan: "",
                        jurusan: "",
                        goldar: "",
                        stambuk: "",
                        tanggal_lahir: "",
                        pfp: null,
                    };
                }
            },
        }
    }
</script>

<style scoped>
</style>
