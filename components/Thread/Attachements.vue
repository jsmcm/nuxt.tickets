<script setup>

let props = defineProps({
    attachement: String
});

let fileName = computed(() => {

    let parts = props.attachement.file_url.split("/");
    return parts[parts.length - 1];
    
});

</script>


<template>
    <a :href="attachement.file_url" target="_new"> - {{ fileName }}</a><br />
</template>