<script setup>

let props = defineProps({
    info: String,
});
</script>

<template>
    <div class="col-sm-auto mt-3 d-grid">
        <button class="btn btn-primary btn-outlined" readonly enabled="false" v-html="info">
        </button>
    </div>
</template>