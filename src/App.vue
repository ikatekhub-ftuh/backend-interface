<template>
    <ConfirmPopup class="max-lg:hidden" group="popup" />
    <ConfirmDialog class="lg:hidden" group="dialog" />
    <Toast class="max-lg:hidden"></Toast>
    <div class="page">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            default: {
                title: 'IKATEKhub FTUH',
                image: 'http://127.0.0.1:8000/storage/'
            }
        };
    },
    provide() {
        return {
            default: this.default
        };
    }
};
</script>
