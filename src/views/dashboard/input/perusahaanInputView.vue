<template>
    <main class="space-y-2">
        <div>
            <div class="input_label">Logo</div>
            <comp-imageUploader ref="uploader" @changeImg="changeImg" />
        </div>
        <div class="top-input-container">
            <div>
                <p class="input_label">Nama Perusahaan</p>
                <InputText v-model="items.nama_perusahaan" placeholder="Nama Perusahaan" fluid />
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
            v$: useVuelidate(),
            items: {
                nama_perusahaan: '',
                logo: null
            },
            clear: {},
            state: {
                _buttonLoading: false
            }
        }
    },
    validations() {
        return {
            items: {
                nama_perusahaan: { required },
                logo: { required }
            }
        }
    },
    methods: {

        clearForm() {
            this.items = { ...this.clear };
            this.$refs.uploader.$refs.fileUpload.clear();
            uptoast(this.$toast, 'info', 'Form telah direset');
        },

        changeImg(img) {
            this.items.logo = img;
        },

        async onConfirmSubmit() {
            this.v$.items.$touch();
            if (this.v$.items.$invalid) {
                uptoast(this.$toast, 'error', 'Form tidak valid');
                return;
            }

            this.state._buttonLoading = true

            const fd = new FormData();
            const headers = {
                'Content-Type': 'multipart/form-data'
            }
            Object.keys(this.items).forEach(key => {
                fd.append(key, this.items[key])
            })

            try {
                const response = await axios.post('loker/perusahaan', fd, { headers })
                uptoast(this.$toast).preset('success')
                this.clearForm()
            } catch (error) {
                uptoast(this.$toast).preset('error')
            } finally {
                this.state._buttonLoading = false
            }
        }
    },
    async mounted() {
        this.clear = { ...this.items }
        this.v$.items.$touch()
    }
};
</script>
<style scoped></style>
