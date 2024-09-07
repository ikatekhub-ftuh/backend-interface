<template>
    <ConfirmPopup class="max-lg:hidden" group="popup" />
    <ConfirmDialog class="lg:hidden" group="dialog" />
    <Toast class="max-lg:hidden"></Toast>
    <div class="page">
        <router-view></router-view>
    </div>
</template>

<script>

import Editor from 'primevue/editor';
// patch for quill editor to fix rendering issue
Editor.methods.renderValue = function renderValue(value) {
    if (this.quill) {
        if (value) {
            const delta = this.quill.clipboard.convert({ html: value });
            this.quill.setContents(delta, 'silent');
        } else {
            this.quill.setText('');
        }
    }
};

export default {
    name: 'App',
    data() {
        return {
            default: {
                title: 'ANTEK HUB',
                image: 'http://api.antekhub.com/storage/'
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
