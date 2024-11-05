<script setup>
  
  import axios from "axios";
  import sweetalert from "sweetalert";

  let config = useRuntimeConfig();

  let auth = useAuth();


let cannedReplies = ref([]);

  onMounted(() => {
  
      useHead(() => {
          return {
              title: "SmartSupport.ai | ML Canned Replies",
          }
      }); 


      axios.get(config.public.apiUrl + "/api/thread/canned-replies", {
        headers: {
          Authorization: "Bearer " + auth.access_token
        }
      })
      .then((response) => {
        console.log("response.data: ");
        console.log(response.data);
        cannedReplies.value = response.data;
      })
      .catch((err) => {
        console.log("err: ");
        console.log(err);
      });


  });


  let deleteReply = (cannedReplyId) => {

    if (useDeleteMLCannedReply(cannedReplyId, auth.access_token, config.public.apiUrl)) {

      const indexToRemove = cannedReplies.value.findIndex(reply => reply.id == cannedReplyId);

      if (indexToRemove > -1) {
        cannedReplies.value.splice(indexToRemove, 1);
      }

      sweetalert({
        text:  "ML Canned Reply Deleted",
        title: "Deleted",
        icon: "success",
        timer: 3500
      });
    }

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
            <h1 class="page-header-title">ML Canned Replies</h1>
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
                <th>Slug</th>
                <th>Message</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

                <MlCannedRepliesReply
                  v-for="reply in cannedReplies"
                  @deleteReply="deleteReply"
                  :key="reply.id"
                  :reply="reply"
                />			  


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