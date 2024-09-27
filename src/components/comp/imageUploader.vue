<template>
    <FileUpload name="thumbnail" :multiple="false" ref="fileUpload" @select="handleFileChange($event)"
        @remove="handleFileChange($event)" :accept="accept" :fileLimit="1" :maxFileSize="2000000">
        <template #header="{ chooseCallback, files }">
            <div class="flex flex-wrap flex-1 justify-between items-center gap-4">
                <div class="flex gap-2">
                    <Button :disabled="files.length !== 0" @click="chooseCallback()" outlined severity="secondary"><span
                            class="pi pi-images" />Pilih</Button>
                </div>
            </div>
        </template>
        <template #empty>
            <p class=" py-5">Drag and drop atau pilih file untuk menambah gambar.</p>
        </template>
    </FileUpload>
</template>
<script>
export default {
    name: 'imageUploader',
    props: {
        accept: {
            type: String,
            default: 'image/png,image/jpeg,image/jpg'
        }
    },
    methods: {
        handleFileChange(e) {
            if (e.files.length === 0) {
                this.$emit('changeImg', null)
                return
            } else if (e.files.length > 1) {
                uptoast(this.$toast, 'info', 'Hanya gambar terbaru yang akan diupload')
                e.files.splice(0, e.files.length - 1)
                this.$emit('changeImg', e.files[0])
                return
            } else {
                // add to snippet
                const file = new File([e.files[0]], e.files[0].name, { type: e.files[0].type });
                this.$emit('changeImg', file);
            }
        }
    },
};
</script>
