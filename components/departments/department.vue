<script setup>

    import sweetalert from "sweetalert";

    let props = defineProps({
        department: Object,
    });


    let emits = defineEmits([
        "deleteDepartment"
    ]);


    let deleteDepartment = () => {


        sweetalert({
            text: "Really delete this department?",
            title: "Are you sure?",
            icon: "warning",      
            buttons: ["No, keep it!", "Yes, I am sure!"],
            dangerMode: true,
        }).then(function (isConfirm) {
            if (isConfirm) {
            
                emits("deleteDepartment", props.department.id);

            } else {
            
                sweetalert({
                    text: "Not deleting department...",
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
        <td class="list-group-item form-check-select">
           {{ department.user_id }}
        </td>
        <td>
            {{ department.department }}
        </td>
      
        <td>{{ department.email }}</td>
        <td>{{ department.mail_host }}</td>
        <td>{{ department.pop_port }}</td>
        <td>{{ department.smtp_port }}</td>
        <td>{{ department.mail_username }}</td>

        <td>
            <NuxtLink
                :to="'/departments/' + department.id"
                class="btn btn-success btn-icon mx-2"
            >
                <i class="bi-pencil-square"></i>
            </NuxtLink>
            <button
                @click="deleteDepartment"
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