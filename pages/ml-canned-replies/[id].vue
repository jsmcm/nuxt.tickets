<script setup>
  

  import axios from "axios";
  import sweetalert from "sweetalert";

  let config = useRuntimeConfig();

  let router = useRouter();

  let { id } = useRoute().params;


  let auth = useAuth();
  let me = useMe();



let formErrors = ref("");

// let config = useConfig();

let email = ref("");
let clientName = ref("");

if (me.getUserLevel() < 50) {
  // we only preset the email for regular users, not
  // admins or moderators because they will likely
  // often forget to change the email address to a 
  // client email and thus it will pass validation
  // but not end up going to the correct email address
  email.value = me.getUserEmail();
  clientName.value = me.getUserName();
}


let thread = ref({})
let message = ref("")
let allCannedReplies = ref([]);
let cannedReplySlugError = ref(false);
let messageError = ref(false);

let submitDisabled = ref(false);


let getThread = (id) => {

  axios
    .get(config.public.apiUrl + "/api/thread/" + id,
    {
      headers: {
        Authorization: "Bearer " + auth.access_token
      }
    })
    .then((response) => {
      thread.value = response.data;
      message.value = thread.value.message;
    })
    .catch((error) => {
        if (error.response.status == 403) {
          sweetalert({
            title: "Forbidden",
            text : "You do not have permission to view this ticket",
            icon : "error",
            timer: 3500
          })

          router.push("/");
        }
    });
  
};
  


let errors = () => {

  formErrors.value = "";

  // canned reply
  if (thread.value.canned_reply == "") {
    cannedReplySlugError.value = true;
    formErrors.value += "<li>Canned reply slug must be selected</li>";
  }

  
  if (message.value == "") {
    messageError.value = true;
    formErrors.value += "<li>Message cannot be blank</li>";
  }

  if (formErrors.value != "") {
    return true;
  }

  return false;
};



let save = () => {

  if (errors() === true) {
    return;
  }

  saveCannedReply(id);
  
};


let saveCannedReply = (threadId) => {

  if (useUpdateMLCannedReply(threadId, message.value, thread.value.canned_reply, auth.access_token, config.public.apiUrl)) {
    sweetalert({
      text:  "Saved",
      title: "Canned reply updated",
      icon: "success",
      timer: 1500
    });
  }

  router.push("/ml-canned-replies");

};


onMounted(() => {
  getThread(id);
});


watch(thread, (newValue) => {
  let replies = useGetWithExpiry("canned_replies");
  allCannedReplies.value = replies.filter(reply => reply.department_id == thread.value.ticket.department.id);

  allCannedReplies.value = allCannedReplies.value.map(reply => {
    reply.slug = reply.slug.substring(0, reply.slug.indexOf('['))
    return reply;
  });
});

  
let deleteReply = () => {
  sweetalert({
      text: "Really delete this canned reply? It only marks the ML slug as delete, the thread is still safe",
      title: "Are you sure?",
      icon: "warning",      
      buttons: ["No, keep it!", "Yes, I am sure!"],
      dangerMode: true,
  }).then(function (isConfirm) {
      if (isConfirm) {
    
        if (useDeleteMLCannedReply(id, auth.access_token, config.public.apiUrl)) {

          router.push("/ml-canned-replies");

          sweetalert({
            text:  "Canned Reply Deleted",
            title: "Deleted",
            icon: "success",
            timer: 1500
          });
        }

      } else {
      
          sweetalert({
              text: "Not deleting canned reply...",
              title: "Not deleting",
              icon: "success",  
              timer: 3500
          });


      }
  });

}


let sortedCannedReplies = computed(() => {

  return allCannedReplies.value.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });
});

</script>

<template>

  <LayoutSiteMain>
    <!-- Content -->
    <div class="content container-fluid">
      <!-- Page Header -->
      <div class="page-header">
        <div class="row align-items-end">


          <div class="col-sm mb-2 mb-sm-0">

            <h1 class="page-header-title">ML Canned Reply</h1>

              <div class="mt-5">
                <h7 class="text-muted">Department: {{ thread?.ticket?.department?.department ?? "" }}</h7>
              </div>
          </div>

          <!-- End Col -->
        </div>
        <!-- End Row -->
		
      </div>
      <!-- End Page Header -->
     
      <div class="row mb-5">
        <div class="col-lg-12 mb-3 mb-lg-0">
              <h7 class="text-muted">Canned Reply Slug</h7>
          <select
            class="form-select form-select-sm"
            :class="{
                'error-border': cannedReplySlugError
              }"
            v-model="thread.canned_reply"
          >
            <option value="" :key="-1">Canned Reply</option>
            <option v-for="aCannedReply in sortedCannedReplies"
              :key="aCannedReply.id"
              :value="aCannedReply.slug"
            >
              {{ aCannedReply.slug }}
            </option>
          </select>
        </div>
      </div>


      <div class="row">
        <div class="col-lg-12 mb-3 mb-lg-0">
          <!-- Card -->
          <h7 class="text-muted">Message</h7>

              <!-- Quill -->
              <div class="quill-custom">
                <textarea class="form-control textarea" :class="{
                'error-border': messageError
              }" style="height: 350px;" v-model="message"></textarea>

              </div>
              <!-- End Quill -->
  
  


            <div
              class="my-3 mb-lg-5 d-flex justify-content-between align-items-center gap-3"
            >

            
              <button
                v-if="id>0"
                class="btn btn-danger"
                @click="deleteReply"
              >
                <i class="bi-x-lg me-1"></i> Delete Canned Reply
              </button>
            
              <button 
                @click="save"
                :disabled="submitDisabled"
                type="button"
                class="btn btn-success btn-lg"
                :class="{
                  displayed: !submitDisabled
                }"
              >
                <span 
                  v-if="submitDisabled"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{ !submitDisabled?"Save Canned Reply":"uploading..."}}
              </button>

            </div>


            <div v-if="formErrors != ''" class="form-error error-border" v-html="formErrors">
            </div>
            
            <!-- End Footer -->
			
			

		</div>
        <!-- End Col -->

      </div>
      <!-- End Row -->

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