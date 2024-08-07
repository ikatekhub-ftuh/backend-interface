<!-- 
 
sidebar_item: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-table',
                        to: 'dashboard',
                    },
                    {
                        label: 'Validasi',
                        icon: 'pi pi-file-check',
                        items: [
                            {
                                label: 'Data Alumni',
                                icon: 'pi pi-users',
                                to: 'testing'
                            },
                            {
                                label: 'Berita',
                                icon: 'pi pi-info-circle',
                            },
                            {
                                label: 'Event',
                                icon: 'pi pi-calendar',
                            },
                        ]
                    },
                    {
                        label: 'Input Data',
                        icon: 'pi pi-file-import',
                        items: [
                            {
                                label: 'Data Alumni',
                                icon: 'pi pi-users',
                                to: 'input alumni'
                            },
                            {
                                label: 'Berita',
                                icon: 'pi pi-info-circle',
                                to: 'input berita'
                            },
                            {
                                label: 'Event',
                                icon: 'pi pi-calendar',
                                to: 'input event'
                            },
                            {
                                label: 'Loker',
                                icon: 'pi pi-briefcase',
                                to: 'input loker'
                            },
                        ]
                    },
                    {
                        label: 'Database',
                        icon: 'pi pi-database',
                        items: [
                            {
                                label: 'Data Alumni',
                                icon: 'pi pi-users',
                            },
                            {
                                label: 'Berita',
                                icon: 'pi pi-info-circle',
                            },
                            {
                                label: 'Event',
                                icon: 'pi pi-calendar',
                            },
                        ]
                    },
                    {
                        label: 'Profile',
                        icon: 'pi pi-user',
                        to: 'profile',
                    },
                    {
                        label: 'Accounts',
                        icon: 'pi pi-shield',
                        items: [
                            {
                                label: 'Admin',
                                icon: 'pi pi-user',
                            },
                            {
                                label: 'User',
                                icon: 'pi pi-users',
                            },
                            {
                                label: 'Ban',
                                icon: 'pi pi-ban',
                            }
                        ]
                    },
                    {
                        label: 'Sign Out',
                        icon: 'pi pi-sign-out',
                        specialAction: 'logout'
                    },
                ]
            }
        },
        
-->

<template>
    <PanelMenu :model="items" class="my-4 px-4 w-full select-none">
        <template #item="{ item }">
            <a @click="() => item.specialAction ? this.$emit(item.specialAction) : item.to ? this.$router.push({name: item.to}): null"
                class="flex items-center px-4 py-2 cursor-pointer group">
                <span :class="[item.icon, 'text-primary group-hover:text-inherit']" />
                <span :class="['ml-2', { 'font-semibold': item.to === $route.name }]">{{ item.label }} </span>
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
        computed: {
        },
        methods: {
        }
    }
</script>

<style scoped>
</style>
