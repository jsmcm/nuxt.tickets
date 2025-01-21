<script setup>
  
  import axios from "axios";
  import sweetalert from "sweetalert";

  let config = useRuntimeConfig();
  
  let auth = useAuth();

let bans = ref([]);

  onMounted(() => {
  
      useHead(() => {
          return {
              title: "SmartSupport.ai | Banned Emails",
          }
      }); 

      axios.get(config.public.apiUrl + "/api/bans", {
        headers: {
          Authorization: "Bearer " + auth.access_token
        }
      })
      .then((response) => {
        bans.value = response.data;
        let set_cache = useSetWithExpiry("bans", bans.value, 8640000);
      })
      .catch((err) => {
        console.log("err: ");
        console.log(err);
      });


  });

let deleteBan = (banId) => {
  if (useDeleteBan(banId, auth.access_token, config.public.apiUrl)) {

    const indexToRemove = bans.value.findIndex(ban => ban.id == banId);

    if (indexToRemove > -1) {
      bans.value.splice(indexToRemove, 1);
      let set_cache = useSetWithExpiry("bans", bans.value, 8640000);
    }

    sweetalert({
      text:  "Ban Deleted",
      title: "Deleted",
      icon: "success",
      timer: 3500
    });
  }
}


let getDate = dateToConvert => {
  const date = new Date(dateToConvert);

  // Extract the date and time components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Format the date and time as desired
  return`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

</script>

<template>


  <LayoutSiteMain>


    <!-- Content -->
    <div class="content container-fluid">
      <!-- Page Header -->
      <div class="page-header">
        <div class="row align-items-center mb-1">
          <div class="col-sm mb-2 mb-sm-0">
            <h1 class="page-header-title">Banned Emails</h1>
          </div>
          <!-- End Col -->
        </div>
        <!-- End Row -->

      </div>
      <!-- End Page Header -->


      <!-- Card -->
      <div class="card">

        <!-- Table -->
        <div class="table-responsive ">
          <table class="table table-striped table-thead-bordered table-nowrap table-align-middle card-table">
            <thead class="">
              <tr>
                <th>Email Address</th>
                <th>Banned On</th>
                <th>&nbsp;</th>
              </tr>
            </thead>

            <tbody>

              <tr v-for="ban of bans">
                <td>{{ ban.email }}</td>
                <td>{{ getDate(ban.created_at) }}</td>
                <td>
                  <button
                      @click="deleteBan(ban.id)"
                      type="button"
                      class="btn btn-danger btn-icon"
                  >
                      <i class="bi-trash"></i>
                  </button>
                </td>	  
              </tr>
              
            </tbody>
          </table>
        </div>
        <!-- End Table -->

      </div>
      <!-- End Card -->
    </div>
    <!-- End Content -->

  </LayoutSiteMain>
   


</template>


<style>

.error-border {
  border: 0.0625rem solid #ed4c78;
}

.form-error {
  border-radius: 0.3125rem;
  display: block;
  text-align:right;
  font-weight: bold;
  width: 100%;
  padding: 0.6125rem 1rem;
  font-size: .875rem;
  font-weight: 400;
  line-height: 1.5;
  background-color: #fff;
  background-clip: padding-box;
  font-size: .875em;
  color: #ed4c78;
}

.no-button {
  background: none;
  border: none;
}

#uploads {
  cursor:pointer;
}

</style>
