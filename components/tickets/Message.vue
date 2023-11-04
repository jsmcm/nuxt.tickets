<script setup>

let props = defineProps({
    ticket: Object
});

</script>
<template>

    <tr>
        <td>{{ ticket.user.email }}</td>
        <td><NuxtLink :to="'/ticket/' + ticket.id">{{ ticket.subject }}</NuxtLink></td>
        <td>{{ ticket.date_opened }}</td>
        <td>{{ ticket.thread[ ticket.thread.length - 1].date }}</td>
        <td>{{ ticket.intent }}</td>
        <td>{{ ticket.department.department }}</td>
        <td>{{ ticket.attachement_count }}</td>
        <td>{{ ticket.status }}</td>
    </tr>
    
</template>