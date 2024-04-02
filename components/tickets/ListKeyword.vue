<script setup>

import axios from "axios";

let props = defineProps({
    searchTerm: String
});

let config = useRuntimeConfig();


let auth = useAuth();
let me = useMe();

let tickets = ref({});

let getTickets = () => {
  
    let results = axios.get(config.public.apiUrl + "/api/tickets/search?search=" + props.searchTerm, {
        headers: {
            Authorization: "Bearer " + auth.access_token
        }
    })
    .then((response) => {
        tickets.value = response.data.data;
    })
    .catch((err) => {
        console.log("err:");
        console.log(err);
    });
  
};
  

onMounted(() => {
    getTickets();
})

</script>
  
  
  <template>

    <!-- Card -->
    <div class="card">

        <!-- Table -->
        <div class="table-responsive ">
            <table class="table table-striped table-thead-bordered table-nowrap table-align-middle card-table">
                <thead class="thead-light">
                    <tr>
                        <th>Client</th>
                        <th>Subject</th>
                        <th>Opened</th>
                        <th>Last Message</th>
                        <th>Intent</th>
                        <th>Department</th>
                        <th>Attachments</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
            
                    <TicketsMessage 
                        v-for="ticket in tickets" 
                        :ticket="ticket" 
                        :key="ticket.id"
                    />
            
                </tbody>
            </table>
        </div>
        <!-- End Table -->
    
    </div>
    <!-- End Card -->

</template>