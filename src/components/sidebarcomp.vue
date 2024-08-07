<template>
    <Drawer :visible="visible" header="Left Drawer" class="hiddenscrollbar">
        <template #container="{ closeCallback }">
            <div class="flex flex-col h-full">
                <div class="flex justify-between items-center px-6 py-4 shrink-0">
                    <div>
                        <p class="font-bold text-3xl">Dashboard</p>
                        <p>{{this.default.title}}</p>
                    </div>
                    <div>
                        <Button icon="pi pi-times" @click="()=>{this.$emit('toggle-drawer')}" />
                    </div>
                </div>
                <div>
                    <PanelMenu :model="items" class="my-4 px-4 w-full">
                        <template #item="{ item }">
                            <a @click="()=> item.to ? linkClicked(item.to) : null"
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
                </div>
            </div>
        </template>
    </Drawer>
</template>

<script>
    export default {
        name: 'sidebarcomp',
        inject: ['default'],
        props: {
            visible: Boolean,
            items: Array,
        },
        methods: {
            linkClicked(to) {
                if (to) {
                    this.$emit('close-drawer');
                    this.$router.push({ name: to });
                }
            }
        }
    }
</script>

<style scoped>
</style>
