<template>
    <div class="border-b-2 w-full">
        <Toolbar class="px-7 border-none select-none rounded-none">
            <template #start>
                <p class="font-semibold text-2xl">{{ this.$route.name ? this.$route.name.charAt(0).toUpperCase()
                    +
                    this.$route.name.slice(1) : '' }}</p>
            </template>

            <template #center>
            </template>

            <template #end>
                <div class="flex justify-between items-center gap-2">
                    <Button icon="pi pi-bars" @click="() => { this.$emit('toggle-drawer') }" class="lg:hidden mr-2"
                        severity="secondary" />
                    <Button icon="pi pi-user" class="mr-2" severity="secondary" />
                </div>
            </template>
        </Toolbar>
    </div>
</template>

<script>
export default {
    name: 'dbheadercomp',
    inject: ['default'],
    methods: {
    }
}
</script>

<style scoped></style>
