<script setup>
import axios from 'axios';

let props = defineProps({
    action: Object,
    apiToken: String,
});

let emits = defineEmits(["action_complete"]);

const doApiAction = () => {
    if (props.action.type == "delete") {
        axios.delete(
            props.action.url, {
                headers: {
                    Authorization: "Bearer " + props.apiToken
                }
            }
        )
        .then(data => {
            sweetAlert({
                text: "Action Completed",
                icon: "success",
                title: "Success",
                timer: 3500,
            });
            emits("action_complete");
        })
        .catch(err => {
            sweetAlert({
                text: err.response.data.Error,
                icon: "error",
                title: "ERROR"
            });
        })
    } else if (props.action.type == "patch") {
        axios.patch(props.action.url, 
            null,
        {
        headers: {
                Authorization: "Bearer " + props.apiToken
            } 
        })
        .then(data => {
            sweetAlert({
                text: "Action Completed",
                icon: "success",
                title: "Success",
                timer: 3500,
            });
            emits("action_complete");
        })
        .catch(err => {
            sweetAlert({
                text: err.response.data.Error,
                icon: "error",
                title: "ERROR"
            });
        });
    };
}
</script>

<template>
    <div class="col-sm-auto mt-3 d-grid">
        <button class="btn btn-secondary" @click="doApiAction" v-html="action.text"></button>
    </div>
</template>