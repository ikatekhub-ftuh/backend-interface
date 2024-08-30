<template>
    <div>

    </div>
</template>

<script>
import axios from 'axios';

export default {
    inject: ['default'],
    data() {
        return {
            data: {},
            visible: true
        };
    },
    methods: {
        getData() {
            axios.get('berita/id/' + this.$route.params.id)
                .then((res) => {
                    this.data = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        toggleLike() {
            this.data.is_liked = !this.data.is_liked;
            this.data.total_like += this.data.is_liked ? 1 : -1;
        },
        formatDate(dateString) {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        }
    },
    mounted() {
        this.getData();
    }
};
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-title {
    font-size: 1.5em;
    margin-bottom: 0.5em;
}

.card-subtitle {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
}

.card-content {
    margin-bottom: 1em;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
