<script setup>

let props = defineProps({
    ticket: Object
});



let formattedDirection = computed(() => {

    
    return props.ticket.thread[ props.ticket.thread.length - 1].type
    .split('-')
    .map(word => 
      // Capitalize the first letter of each word and add the rest of the lowercase letters
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ')
    .trim()
});


</script>
<template>

    <tr>
        <td>{{ ticket.user.email }}</td>
        <td><NuxtLink :to="'/ticket/' + ticket.id">{{ ticket.subject?ticket.subject:" [Blank]" }}</NuxtLink></td>
        <td>{{ ticket.date_opened }}</td>
        <td>{{ ticket.thread[ ticket.thread.length - 1].date }}</td>
        <td>{{ formattedDirection }}</td>
        <td>{{ ticket.intent }}</td>
        <td>{{ ticket.department.department }}</td>
        <td>{{ ticket.attachement_count }}</td>
        <td>{{ ticket.status }}</td>
    </tr>
    
</template>