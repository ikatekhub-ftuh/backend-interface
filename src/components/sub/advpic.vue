<!-- TODO fix the damn file uploader, atau ganti saja sama yang lain deh apakah ini sumpahka -->

<template>
    <FileUpload name="thumbnail" :multiple="false" ref="fileUpload" @select="handleFileChange(false, $event)"
        @remove="handleFileChange(true, $event)" accept="image/png,image/jpeg,image/jpg" :fileLimit="1"
        :maxFileSize="2000000">
        <template #header="{ chooseCallback, clearCallback, files }">
            <div class="flex flex-wrap flex-1 justify-between items-center gap-4">
                <div class="flex gap-2">
                    <Button :disabled="files.length !== 0" @click="chooseCallback()" outlined severity="secondary"><span
                            class="pi pi-images" />Pilih</Button>
                </div>
                <!-- file size -->
                <!-- <div class="whitespace-nowrap">{{files.length !== 0 ? files[0].name + ' - ' + (files[0].size /
                    2000).toFixed(2) + 'KB / 2Mb' : '0KB / 2Mb'}}</div> -->
            </div>
        </template>
        <template #empty>
            <p class="max-lg:hidden py-5">Drag and drop atau pilih file untuk mengubah thumbnail.</p>
            <p class="lg:hidden py-5">Pilih file untuk mengubah thumbnail.</p>
        </template>
    </FileUpload>
</template>

<script>
export default {
    name: 'AdvPic',
    methods: {
        handleFileChange(remove = false, e) {
            if (remove) {
                this.$emit('changeImg', null)
                console.log('remove')
            } else {
                const file = new File([e.files[0]], e.files[0].name, { type: e.files[0].type });
                this.$emit('changeImg', file);
                console.log('add')
            }
        },
    },
}
</script>

<style scoped></style>
