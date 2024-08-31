<template>
    <div class="card">
        {{ user }}
        <Panel header="Account">
            <template #footer>
                <div class="flex flex-wrap items-center justify-end gap-4">
                    <span class="text-surface-500 dark:text-surface-400">Terakhir diupdate: {{ updateAt }}</span>
                </div>
            </template>
            <template #icons>
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-secondary" />
                <Button icon="pi pi-shield" severity="secondary" rounded text />
            </template>

            <div class="flex items-center gap-2">
                <Image id="user.pfp" :src="this.default.image + 'user.avatar'" @error="onImageError('user.pfp')"
                    shape="circle" />
            </div>
        </Panel>
    </div>
</template>

<script>

export default {
    inject: ['default'],
    data() {
        return {
            errorState: {}
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
        updateAt() {
            const timeAgo = useTimeAgo(new Date(this.user.updated_at));
            return timeAgo;
        }
    },
    methods: {
        save() {
            this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
        },
        async onImageError(id) {
            const el = document.getElementById(id);
            el.classList.add('hidden');
            this.errorState[id] = true;
        }
    }
}
</script>
