<script setup>

import axios from "axios";
import sweetalert from "sweetalert";

let props = defineProps({
    thread: Object,
    ticket: Object,
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


let sendAttachments = () => {

    // console.log("sending attachments: ");
    // console.log(props.thread.attachement);
    // console.log("for: ");
    // console.log(props.ticket.user.email);
    // console.log("subject: ");
    // console.log(props.ticket.subject);

    let attachments = [];
    
    for (let x = 0; x < props.thread.attachement.length; x++) {
        attachments.push(props.thread.attachement[x].file_url);
    }

    let url     = props.ticket.department.api_base_url + "tickets/attachments";
    let token   = props.ticket.department.api_token;
    let email   = props.ticket.user.email;
    let subject = props.ticket.subject;


    axios.post(url, {
       attachments: attachments,
       email: email,
       subject: subject
    },
    {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    .then((response) => {
        // console.log("response: ");
        // console.log(response);

        if (response.status == 200) {
            sweetalert({
                title: "Images added",
                text : response.data.data,
                icon : "success",
                timer: 3500
            });
        }

    })
    .catch((error) => {
        console.log("error: ");
        console.log(error);
        sweetalert({
            title: "Oops",
            text : error.response.data.message,
            icon : "error",
            timer: 3500
        });

    })
    

};

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

                <p v-if="(ticket.department.api_base_url != null && ticket.department.api_base_url != '') && (ticket.department.api_token != null && ticket.department.api_token != '')">
                    <button class="btn btn-primary btn-sm" @click="sendAttachments">Push to Webhook</button>
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


