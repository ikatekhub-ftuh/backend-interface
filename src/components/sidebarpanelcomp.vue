<template>
    <PanelMenu :model="items" class="my-4 px-4 w-full select-none">
        <template #item="{ item }">
            <a @click="() => item.to? this.$router.push({name: item.to}): null"
                class="flex items-center px-4 py-2 cursor-pointer group">
                <span :class="[item.icon, 'text-primary group-hover:text-inherit']" />
                <span :class="['ml-2', { 'font-semibold': item.to === $route.name }]">{{ item.label }}</span>
                <!-- dropdown icon -->
                <span v-if="item.items" class="ml-auto">
                    <i class="pi pi-angle-down" />
                </span>
            </a>
        </template>
    </PanelMenu>
</template>

<script>
    export default {
        name: 'sidebarpanelcomp',
        props: {
            items: Array,
        },
    }
</script>

<style scoped>
</style>
