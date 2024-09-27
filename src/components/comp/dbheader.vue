<template>
    <div>
        <!-- {{ $route.matched }} -->
    </div>
    <div class="border-b-2 w-full">
        <Toolbar class="px-7 border-none select-none rounded-none">
            <template #start>
                <p class="font-semibold text-2xl">
                    {{ pageTitle }}
                </p>
            </template>

            <template #center>
            </template>

            <template #end>
                <div class="flex justify-between items-center gap-2 *:h-full">
                    <Button class="lg:hidden" severity="secondary">
                        <i class="pi pi-bars" @click="toggleDrawer" />
                    </Button>
                    <Button severity="secondary">
                        <RouterLink :to="{ name: 'home' }" class="pi pi-home"></RouterLink>
                    </Button>
                    <Button class="mr-1" severity="secondary">
                        <RouterLink :to="{ name: 'home' }" class="pi pi-user"></RouterLink>
                    </Button>
                </div>
            </template>
        </Toolbar>
    </div>
</template>

<script>
export default {
    name: 'dbheadercomp',
    computed: {
        pageTitle() {
            return mstr(this.$route.name).capitalize(true)
        },
    },
    methods: {
        toggleDrawer() {
            this.$emit('toggle-drawer')
        },
    },
    emits: ['toggle-drawer'],
}
</script>

<style scoped></style>
