<script setup>
  
  import "~/public/vendor/quill/dist/quill.snow.css";

  import axios from "axios";
  import sweetalert from "sweetalert";

  let config = useConfig();

  let router = useRouter();

  let { id } = useRoute().params;


  let auth = useAuth();
  let me = useMe();
  
  onMounted(() => {
      HSCore.components.HSQuill.init('.js-quill');

      useHead(() => {
          return {
              title: "SmartSupport.ai | Canned Reply",
          }
      }); 

  });


let formErrors = ref("");

// let config = useConfig();
let ticket = ref([]);
let threads = ref([]);
let subjectError = ref(false);

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


let title = ref("");
let titleError = ref(false);

let department = ref("");
let departmentError = ref(false);

let message = ref("");
let messageError = ref(false);

let useMl = ref(false);


let status = ref("");
let user = reactive({});

let submitDisabled = ref(false);

let getCannedReply = (id) => {
  
  // This is a new ticket
  if (id == 0) {
    return;
  }

  axios
    .get(config.apiUrl + "/api/canned-replies/" + id,
    {
      headers: {
        Authorization: "Bearer " + auth.access_token
      }
    })
    .then((response) => {

      console.log("response:");
      console.log(response);

      title.value = response.data.data.title;
      message.value = response.data.data.message;

      useMl.value = !!response.data.data.use_ml;
      department.value = response.data.data.department_id;

      var myEditor = document.querySelector('.js-quill')
      myEditor.children[0].innerHTML = message.value;

    })
    .catch((error) => {
      
        console.log("error: ");
        console.log(error);

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
  

let createCannedReply = async () => {

  try {

      var myEditor = document.querySelector('.js-quill')
      var html = myEditor.children[0].innerHTML

      const response = await axios.post(config.apiUrl + "/api/canned-replies", {
        message : html,
        title   : title.value, 
        department: department.value,
        use_ml  : useMl.value,
      }, {
        headers: {
          Authorization: "Bearer " + auth.access_token
        }
      })
      .then((response) => {

        console.log("response:", response);

        if (response.status === 200) {
            return true
        } else {
            // console.error("Non-200 response status:", response.status);
            return false; // or throw an error, or handle differently as per your use case
        }

      })
      .catch((err) => {
        console.log("err:", err);
      });

    return response;
  } catch (error) {
    throw (error);
  }
}



let errors = () => {

  formErrors.value = "";

  // new canned reply
  if (title.value == "") {
    titleError.value = true;
    formErrors.value += "<li>Title cannot be blank</li>";
  }

  
  if (department.value == "") {
    departmentError.value = true;
    formErrors.value += "<li>Select a department</li>";
  }


  var myEditor = document.querySelector('.js-quill')
  var html = myEditor.children[0].innerHTML


  if (html == "" || html == "<p></p>" || html == "<p><br></p>") {
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

  if (id == 0) {

    // New CannedReply
    createCannedReply()
    .then((response) => {
      console.log("Response: ");
      console.log(response);
      if (response) {
        sweetalert({
          text:  "Saved",
          title: "Canned reply saved",
          icon: "success",
          timer: 1500
        });

        router.push("/canned-replies");
      }
    })
    .catch((error) => {
        console.error("Error creating ticket:", error);
    });



  } else {
    saveCannedReply(id);
  }

};









let saveCannedReply = (cannedReplyId) => {
  
  var myEditor = document.querySelector('.js-quill')
  var html = myEditor.children[0].innerHTML

  if (useUpdateCannedReply(cannedReplyId, html, title.value, useMl.value, auth.access_token, config.apiUrl)) {
    sweetalert({
      text:  "Saved",
      title: "Canned reply updated",
      icon: "success",
      timer: 1500
    });
  }

};






onMounted(() => {

  getCannedReply(id);
})







  let departments = ref([]);

  let getDepartments = () => {

    axios
      .get(config.apiUrl + "/api/departments",
      {
        headers: {
          Authorization: "Bearer " + auth.access_token,
        }
      })
      .then((response) => {

        // console.log("response: ");
        // console.log(response);
          if (response.status == 200 && response.data.status == "success") {
            departments.value = response.data.data;
          }
        
      })
      .catch((error) => {
        
          console.log("error 1: ");
          console.log(error);
        
      });

  }


  onMounted(() => {
    getDepartments();
  });



  
  function departmentUserName(department)
  {

    if (department.user) {
      return department.user.name + " - ";
    } else {
      return "";
    }

  }


  let newThreadTitle = computed(() => {
  
    if (id == 0) {
      return "Message"
    }
    
    if (replyType.value == "to-client" || replyType.value == "from-client") {
      return "Reply";
    }
    
    return "Internal Note";

  });


  
let deleteReply = () => {


  sweetalert({
      text: "Really delete this canned reply?",
      title: "Are you sure?",
      icon: "warning",      
      buttons: ["No, keep it!", "Yes, I am sure!"],
      dangerMode: true,
  }).then(function (isConfirm) {
      if (isConfirm) {
    
        if (useDeleteCannedReply(id, auth.access_token, config.apiUrl)) {

          router.push("/canned-replies");

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




</script>

<template>

 

  <LayoutSiteMain>
    <!-- Content -->
    <div class="content container-fluid">
      <!-- Page Header -->
      <div class="page-header">
        <div class="row align-items-end">


          <div class="col-sm mb-2 mb-sm-0">

            <h1 class="page-header-title">New Canned Reply</h1>

            <div class="mt-5">
              <h7 class="text-muted">Title</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': titleError
                }"
                v-model="title"
                @keydown="titleError = false"
                placeholder="Canned Reply"
              >
            </div>


            <div class="mt-5">

              <div class="form-check form-switch mb-4">
                <input
                  v-model="useMl"
                  type="checkbox"
                  class="form-check-input"
                >
                <label class="form-check-label" for="formSwitch2">Use ML</label>
              </div>

            </div>



            <div v-if="me.getUserLevel() >= 50" class="mt-5">
              <h7 class="text-muted">Department</h7>
              <select
                class="form-select" 
                :class="{
                'error-border': departmentError
                }"
                v-model="department"
                @keydown="departmentError = false"
              >
                <option
                  v-for="department in departments"
                  :key="department.id"
                  :value="department.id"
                  v-text="departmentUserName(department) + department.department"
                ></option>
                </select>
              </div>
          </div>

          <!-- End Col -->
        </div>
        <!-- End Row -->
		
      </div>
      <!-- End Page Header -->
	  
      <div class="row">
        <div class="col-lg-12 mb-3 mb-lg-0" :class="{
                'error-border': messageError
              }">
          <!-- Card -->
          <h7 class="text-muted">Message</h7>

              <!-- Quill -->
              <div class="quill-custom">
                <div class="js-quill" style="height: 15rem;" data-hs-quill-options='{
                     "placeholder": "Type your message...",
                      "modules": {
                        "toolbar": [
                          ["bold", "italic", "underline", "strike", "link", "image", "blockquote", "code", {"list": "bullet"}]
                        ]
                      }
                     }'>
                </div>
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