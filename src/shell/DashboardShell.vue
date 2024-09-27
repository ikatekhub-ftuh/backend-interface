<!-- comment -->

<template>
    <comp-sidebarcomp class="lg:hidden" :items="sidebar_item" :visible="visibleSidebar" @logout="onLogout"
        @toggle-drawer="toggleSidebar" />
    <main class="flex h-full overflow-hidden">
        <div class="side-panel hiddenscrollbar">
            <div class="side-header">
                <p class="font-bold text-3xl">Dashboard</p>
                <p class="mt-1">{{ appdata.title }}</p>
            </div>
            <comp-sidebarpanel :items="sidebar_item" @logout="onLogout"></comp-sidebarpanel>
        </div>
        <div class="content">
            <comp-dbheader @toggle-drawer="toggleSidebar"></comp-dbheader>
            <div class="p-[2rem]">
                <router-view></router-view>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    name: 'DashboardShell',
    data() {
        return {
            authStore: useAuthStore(),
            appdata,
            visibleSidebar: false,
            sidebar_item: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-table',
                    to: 'dashboard',
                },
                {
                    label: 'Input Data',
                    icon: 'pi pi-file-import',
                    items: [
                        {
                            label: 'Berita',
                            icon: 'pi pi-info-circle',
                            to: 'input berita'
                        },
                        {
                            label: 'Loker',
                            icon: 'pi pi-briefcase',
                            to: 'input loker'
                        },
                        {
                            label: 'Event',
                            icon: 'pi pi-calendar-plus',
                            to: 'input event'
                        },
                        {
                            label: 'Perusahaan',
                            icon: 'pi pi-building',
                            to: 'input perusahaan'
                        },
                    ]
                },
                {
                    label: 'Database',
                    icon: 'pi pi-database',
                    items: [
                        {
                            label: 'Alumni',
                            icon: 'pi pi-user',
                            to: 'data alumni'
                        },
                        {
                            label: 'Berita',
                            icon: 'pi pi-info-circle',
                            to: 'data berita'
                        },
                        {
                            label: 'Loker',
                            icon: 'pi pi-briefcase',
                            to: 'data loker'
                        },
                        {
                            label: 'Event',
                            icon: 'pi pi-calendar-plus',
                            to: 'data event'
                        },
                        {
                            label: 'Perusahaan',
                            icon: 'pi pi-building',
                            to: 'data perusahaan'
                        },
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
    methods: {
        toggleSidebar() {
            this.visibleSidebar = !this.visibleSidebar;
        },
        onLogout() {
            this.authStore.logout().then(() => {
                this.$router.push({ name: 'login' });
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Anda berhasil log-out', life: 3000 });
            }).catch(() => {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Anda gagal log-out', life: 3000 });
            });
        }
    },
}
</script>

<style scoped>
.side-header {
    @apply bg-white px-4 py-5 select-none;
}

.side-panel {
    @apply max-lg:hidden bg-gray-100 border-r-2 w-[300px] overflow-y-scroll;
}

.content {
    @apply flex flex-col w-full max-h-screen overflow-scroll;
}
</style>
