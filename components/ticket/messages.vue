<script setup>

let props = defineProps({
    threads: Object,
    ticket: Object
});

</script>

<template>

    <div class="row justify-content-lg-center mb-5">
        <div class="col-lg-12">
            <div class="d-grid gap-3 gap-lg-5">
		  
                <TicketMessage
                    v-for="thread in threads"
                    :key="thread.id"
                    :thread="thread"
                    :ticket="ticket"
                    :id="thread.id"
                    style="scroll-margin-top:200px;"
                ></TicketMessage>    
			
            </div>
        </div>
        <!-- End Col -->
    </div>
    <!-- End Row -->
	    
</template>