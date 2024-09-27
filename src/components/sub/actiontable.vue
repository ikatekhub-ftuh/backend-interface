<template>
    <div class="flex gap-2">
        <Button icon="pi pi-eye" class=" p-button-outlined" />
        <Button icon="pi pi-pencil" class=" p-button-outlined" severity="warn" />
        <Button icon="pi pi-trash" class=" p-button-outlined" severity="danger" @click="onDelete($event)" />
    </div>
</template>
<script>
export default {
    name: 'actiontable',
    props: {
        id: {
            type: Number,
            required: false
        }
    },
    methods: {
        onDelete(event) {
            if (!this.id) return
            this.$emit('delete', this.id, event)
        }
    },
    emits: ['delete']
};
</script>
