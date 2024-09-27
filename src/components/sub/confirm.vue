<template>
    <Button :label="yeslabel" :loading="isLoading" :disabled="off || isLoading" @click="onSubmit($event)"
        severity="success" />
    <Button :class="hideno ? 'hidden' : 'ml-2'" :label="noLabel" :disabled="noOff || isLoading" @click="onClear($event)"
        severity="danger" />
</template>
<script>

const groupEnum = {
    dialog: 'dialog',
    popup: 'popup',
    auto: 'auto',
}

export default {
    name: 'confirm',
    props: {
        hideno: {
            type: Boolean,
            default: false
        },
        off: {
            type: Boolean,
            default: false
        },
        noOff: {
            type: Boolean,
            default: false
        },
        yeslabel: {
            type: String,
            default: 'Lanjut'
        },
        noLabel: {
            type: String,
            default: 'Batal'
        },
        group: {
            type: String,
            default: groupEnum.auto,
            validator: (value) => Object.values(groupEnum).includes(value),
        },
        header: {
            type: String,
            default: 'Konfirmasi',
        },
        message: {
            type: String,
            default: 'Yakin ingin melanjutkan?',
        },
        yesicon: {
            type: String,
            default: 'pi pi-save',
        },
        noicon: {
            type: String,
            default: 'pi pi-exclamation-triangle',
        },
        yesAcceptProps: {
            type: Object,
            default: () => ({
                label: 'Ya',
                severity: 'success',
            }),
        },
        yesRejectProps: {
            type: Object,
            default: () => ({
                label: 'Ya',
                severity: 'danger',
            }),
        },
        noProps: {
            type: Object,
            default: () => ({
                label: 'Tidak',
                severity: 'secondary',
                outlined: true,
            }),
        },
        acceptToast: {
            type: Object,
            default: () => ({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'Aksi sukses dijalankan',
                life: 3000,
            }),
        },
        rejectToast: {
            type: Object,
            default: () => ({
                severity: 'warn',
                summary: 'Batal',
                detail: 'Aksi batal dijalankan',
                life: 1500,
            }),
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        smallScreen() {
            return window.innerWidth < 1024;
        },
        onSubmit(event) {
            this.$confirm.require({
                target: event.currentTarget,
                header: this.header,
                group: this.group === groupEnum.auto ? (this.smallScreen() ? groupEnum.dialog : groupEnum.popup) : this.group,
                message: this.message,
                icon: this.yesicon,
                acceptProps: this.yesAcceptProps,
                rejectProps: this.noProps,
                accept: () => {
                    this.$emit('yes')
                },
                reject: () => {
                    this.$toast.add(this.rejectToast)
                }
            });
        },
        onClear(event) {
            this.$confirm.require({
                target: event.currentTarget,
                header: this.header,
                group: this.group === groupEnum.auto ? (this.smallScreen() ? groupEnum.dialog : groupEnum.popup) : this.group,
                message: this.message,
                icon: this.noicon,
                acceptProps: this.yesRejectProps,
                rejectProps: this.noProps,
                accept: () => {
                    this.$emit('no')
                },
                reject: () => {
                    this.$toast.add(this.rejectToast)
                }
            });
        },
    },
    emits: ['yes', 'no'],
};
</script>
