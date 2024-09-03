<template>
    <sidebarcomp class="lg:hidden " :items="sidebar_item" :visible="visibleSidebar" @logout="onLogout()"
        @toggle-drawer="toggleSidebar()" />
    <div class="flex h-full overflow-hidden">
        <div class="max-lg:hidden bg-gray-100 border-r-2 w-[300px] overflow-y-scroll hiddenscrollbar">
            <div class="bg-white px-4 py-5 select-none heading">
                <p class="font-bold text-3xl">Dashboard</p>
                <p class="mt-1">{{ this.default.title }}</p>
            </div>
            <sidebarpanelcomp :items="sidebar_item" @logout="onLogout()"></sidebarpanelcomp>
        </div>
        <div class="flex flex-col w-full content">
            <dbheadercomp @toggle-drawer="toggleSidebar()"></dbheadercomp>
            <div class="p-[2rem] ">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardShell',
    inject: ['default'],
    data() {
        return {
            visibleSidebar: false,
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
                            label: 'Data Alumni',
                            icon: 'pi pi-users',
                        },
                        {
                            label: 'Berita',
                            icon: 'pi pi-info-circle',
                            to: 'data news'
                        },
                        {
                            label: 'Event',
                            icon: 'pi pi-calendar',
                            to: 'data event'
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
                    onlysu: true,
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
    computed: {
        ...mapGetters({
            role: 'auth/role'
        }),
    },
    methods: {
        ...mapActions({
            logout: 'auth/logout'
        }),
        toggleSidebar() {
            this.visibleSidebar = !this.visibleSidebar;
        },
        onLogout() {
            this.logout().then(() => {
                console.log('Logged out');
                this.$router.push({ name: 'login' });
            }).catch((err) => {
                console.log(err);
            });
        }
    },
}
</script>

<style></style>

<style scoped>
.content {
    overflow: scroll;
    max-height: 100dvh;
}
</style>
