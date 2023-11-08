<script setup>

// import { useConfig } from "@/stores/Config.js";
import axios from "axios";

let config = useConfig();


let auth = useAuth();
let me = useMe();

// console.log("auth: ");
// console.log(auth);
// console.log("me: ");
// console.log(me.getUserEmail());

// let config = useConfig();
let tickets = ref({});

let getTickets = () => {
  
  axios
    .get(config.apiUrl + "/api/tickets",
      {
        headers: {
          Authorization: "Bearer " + auth.access_token,
        }
      })
    .then((response) => {
        
        // console.log("response.data.data: ");
        // console.log(response.data.data);

        if (response.data.data.length > 0) {
            tickets.value = response.data.data
        }

      
    })
    .catch((error) => {
      
        // console.log("error: ");
        // console.log(error);
      
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
                        <th>From</th>
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