<script setup>

let props = defineProps({
    thread: Object,
});



let messageBorder = computed(() => {

    if (props.thread.type == "from-client") {
        return "success";
    } else if (props.thread.type == "to-client") {
        return "danger";
    } else if (props.thread.type == "internal-note") {
        return "info";
    }

});


</script>

<template>

<!-- Card -->
<div class="card border border-2 mb-3" :class="'border-' + messageBorder">

    <div class="title" :class="thread.type">{{ thread.type }}</div>

    <!-- Body -->
    <div class="card-body">

        <div class="row mb-2">
            <div class="col-12">
                <span>
                    <i class="bi-calendar me-1"></i> {{ thread.date }}
                </span>
            </div>
            <!-- End Col -->
        </div>
        <!-- End Row -->

        <div class="row">
            <div class="col-12 mb-4 mb-md-0" v-html="thread.message"></div>
            <!-- End Col -->            
            
            <div v-if="thread.attachement.length > 0" class="col-12 mb-1 mb-md-0 mt-3">
                <span class="bold">Attachments</span>
                <p>
                    <ThreadAttachements v-for="attachement in thread.attachement" :attachement="attachement" :key="attachement.id" />
                </p>
            </div>
            <!-- End Col -->
        </div>
        <!-- End Row -->

    </div>
    <!-- End Body -->

</div>
<!-- End Card -->

</template>

<style>

.bold {
    font-weight: bold;
}
.title {
    margin-top:-12px;
    margin-left:20px;
    margin-bottom:0;
    padding-bottom:0;
    font-weight: bold;
    padding-left: 5px;
    background:white;

}    

.to-client {
    width:5em;
}

.from-client {
    width:6em;
}

.internal-note {
    width:7.5em;
}

</style>


