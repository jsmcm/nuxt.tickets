<script setup>

    import sweetalert from "sweetalert";

    let props = defineProps({
        reply: Object,
    });


    let emits = defineEmits([
        "deleteReply",
        "useMl"
    ]);


    let deleteReply = () => {


        sweetalert({
            text: "Really delete this canned reply?",
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
    
    let ml = ref(!!props.reply.use_ml);


    watch(ml, (newMl) => {
        emits("useMl", {
            useMl: newMl,
            cannedReplyId: props.reply.id
        });
    });


    let strippedCannedReply = computed(() => {
        return props.reply.message.replace(/<\/?[^>]+>/ig, " ").substr(0, 100);
    });


</script>

<template>
    
    <tr>
        <td class="list-group-item form-check-select">
            <input
                class="form-check-input"
                type="checkbox"
                v-model="ml"
            >
        </td>
        <td>
            {{ reply.title }}
        </td>
        <!-- <td>{{ reply.slug }}</td> -->
        <td>{{ strippedCannedReply }}</td>
        <td>{{ reply.department.department }}</td>
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