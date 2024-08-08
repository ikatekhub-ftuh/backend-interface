<template>
    <div class="flex items-center max-md:justify-between gap-2 p-4 rounded-xl bg-gray-200">
        <img v-if="preview.img !== null" :src="preview.img" alt="pfp" class="w-16 h-16 rounded-full" />
        <div v-else class="rounded-full bg-white">
            <Avatar image="" size="xlarge" shape="circle" icon="pi pi-user" class="border-2" />
        </div>
        <div class="flex items-center ">
            <Button size="small" @click="() => this.$refs.ref__inputfile.click()" v-if="this.preview.img == null"
                type="button" label="select" icon="pi pi-upload" />
            <Button size="small" type="button" label="clear" icon="pi pi-trash"
                @click="() => {this.preview.img = null; this.$emit('changedImg', null)}"
                v-if="this.preview.img !== null" />
            <input @change="onFileChange($event)" ref="ref__inputfile" type="file" class="hidden"
                accept="image/png,image/jpeg,image/jpg" :multiple="false" />
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                preview: {
                    img: null,
                },
            }
        },

        methods: {
            onFileChange(e) {
                const file = e.target.files[0];
                if (file.size > 2 * 1024 * 1024) {
                    this.$toast.add({
                        severity: "error",
                        summary: "Error",
                        detail: `File terlalu besar: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
                        life: 3000,
                    });
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.preview.img = URL.createObjectURL(file);
                    this.$emit('changedImg', file);
                };
                reader.readAsDataURL(file);
            },
        },

    }
</script>

<style scoped>
</style>
