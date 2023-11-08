<script setup>
  
  import axios from "axios";
  import sweetalert from "sweetalert";

  let config = useConfig();

//   let router = useRouter();

//   let { id } = useRoute().params;
  
  let auth = useAuth();
//   let me = useMe();



let cannedReplies = ref([]);

  onMounted(() => {
  
      useHead(() => {
          return {
              title: "SmartSupport.ai | Canned Replies",
          }
      }); 


      axios.get(config.apiUrl + "/api/canned-replies", {
        headers: {
          Authorization: "Bearer " + auth.access_token
        }
      })
      .then((response) => {
        console.log("response: ");
        console.log(response);
        cannedReplies.value = response.data.replies;
        let set_cache = useSetWithExpiry("canned_replies", response.data.replies, 86400000);

      })
      .catch((err) => {
        console.log("err: ");
        console.log(err);
      });


  });


// const now = new Date();

// const year = now.getFullYear();
// const month = String(now.getMonth() + 1).padStart(2, '0'); // month is zero-indexed
// const day = String(now.getDate()).padStart(2, '0');
// const hours = String(now.getHours()).padStart(2, '0');
// const minutes = String(now.getMinutes()).padStart(2, '0');
// const seconds = String(now.getSeconds()).padStart(2, '0');


// let formErrors = ref("");

// let config = useConfig();
// let ticket = ref([]);
// let threads = ref([]);
// let subject = ref("");
// let subjectError = ref(false);

// let email = ref("");
// let clientName = ref("");


// let emailError = ref(false);
// let clientNameError = ref(false);

// let department = ref("");
// let departmentError = ref(false);

// let messageError = ref(false);
// let status = ref("");
// let user = reactive({});

// let submitDisabled = ref(false);



// let closeTicket = () => {

//   //console.log("closeTicket " + id);

// axios
//   .patch(config.apiUrl + "/api/ticket/" + id,
//   {
//     status: 'closed'
//   },
//   {
//     headers: {
//       Authorization: "Bearer " + auth.access_token,
//     }
//   })
//   .then((response) => {

//     // console.log("response: ");
//     // console.log(response);
//       if (response.status == 200 && response.data.status == "success") {
//         return true;
//       }
    
//   })
//   .catch((error) => {
    
//       // console.log("error 1: ");
//       // console.log(error);
    
//   });

//   return false;

// }




// let close = () => {


//   sweetalert({
    
//     text: "Really close this ticket?",
//     title: "Are you sure?",
//     icon: "warning",      
//     buttons: ["No, keep it open!", "Yes, I am sure!"],
//     dangerMode: true,

//   }).then(function (isConfirm) {
//     if (isConfirm) {
     
//       closeTicket();
//       router.push("/");

//     } else {
     
//       sweetalert({
    
//         text: "Not closing ticket...",
//         title: "Not closing",
//         icon: "success",  
//         timer: 3500
//       });


//     }
//   });

// };


let useMl = (replyObject) => {
  
  const index = cannedReplies.value.findIndex(reply => reply.id == replyObject.cannedReplyId);
  cannedReplies.value[index].use_ml = replyObject.useMl;

  
    if (useUpdateCannedReply(replyObject.cannedReplyId, cannedReplies.value[index].message, cannedReplies.value[index].title, replyObject.useMl, auth.access_token, config.apiUrl)) {
      sweetalert({
        text:  "ML Set",
        title: "ML Set to " + cannedReplies.value[index].use_ml,
        icon: "success",
        timer: 1500
      });
    }

  
};

let deleteReply = (cannedReplyId) => {

  if (useDeleteCannedReply(cannedReplyId, auth.access_token, config.apiUrl)) {

    const indexToRemove = cannedReplies.value.findIndex(reply => reply.id == cannedReplyId);

    if (indexToRemove > -1) {
      cannedReplies.value.splice(indexToRemove, 1);
      let set_cache = useSetWithExpiry("canned_replies", cannedReplies.value, 86400000);
    }

    sweetalert({
      text:  "Canned Reply Deleted",
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
            <h1 class="page-header-title">Canned Replies</h1>
			
          </div>
          <!-- End Col -->

          <div class="col-sm-auto">
            <NuxtLink class="btn btn-primary" to="/canned-replies/0">New Canned Reply</NuxtLink>
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
                <th>ml</th>
                <th>Title</th>
                <!-- <th>Slug</th> -->
                <th>Message</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

                <CannedRepliesReply
                  @deleteReply="deleteReply"
                  @useMl="useMl"
                  v-for="reply in cannedReplies"
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