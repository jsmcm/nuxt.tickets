<script setup>

    import sweetalert from "sweetalert";

    let props = defineProps({
        reply: Object,
    });


    let emits = defineEmits([
        "deleteReply",
        "useMl"
    ]);




    let strippedCannedReply = computed(() => {
        return props.reply.message.replace(/<\/?[^>]+>/ig, " ").substr(0, 100);
    });



    let deleteReply = () => {


        sweetalert({
            text: "Really delete this canned reply? This will not delete the thread, just the ML tag.",
            title: "Are you sure?",
            icon: "warning",      
            buttons: ["No, keep it!", "Yes, I am sure!"],
            dangerMode: true,
        }).then(function (isConfirm) {
            if (isConfirm) {
            
                emits("deleteReply", props.reply.id);

            } else {
            
                sweetalert({
                    text: "Not deleting canned reply...",
                    title: "Not deleting",
                    icon: "success",  
                    timer: 3500
                });


            }
        });


    };


</script>

<template>
    
    <tr>
        <td>
            {{  reply.canned_reply }}
        </td>
        <!-- <td>{{ reply.slug }}</td> -->
        <td>{{ strippedCannedReply }}</td>
        <td>{{ reply.ticket?.department?.department ?? "" }}</td>
        <td>
            <NuxtLink
                :to="'/canned-replies/' + reply.id"
                class="btn btn-success btn-icon mx-2"
            >
                <i class="bi-pencil-square"></i>
            </NuxtLink>
            <button
                @click="deleteReply"
                type="button"
                class="btn btn-danger btn-icon"
            >
                <i class="bi-trash"></i>
            </button>
        </td>
    </tr>


</template>

<style>
.list-group-item {
    display: table-cell;
}
</style>