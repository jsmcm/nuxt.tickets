<script setup>
  
  import "~/public/vendor/quill/dist/quill.snow.css";

  import axios from "axios";
  import sweetalert from "sweetalert";

  let config = useRuntimeConfig();

  let router = useRouter();

  let { id } = useRoute().params;


  let auth = useAuth();
  let me = useMe();
  
  onMounted(() => {
      HSCore.components.HSQuill.init('.js-quill');

      useHead(() => {
          return {
              title: "SmartSupport.ai | Department",
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


let departmentEmail = ref("");
let departmentEmailError = ref(false);

let department = ref("");
let departmentError = ref(false);


let signature = ref("");
let signatureError = ref(false);


let logoUrl = ref("");
let logoUrlError = ref(false);


let mailHost = ref("");
let mailHostError = ref(false);

let mailUsername = ref("");
let mailUsernameError = ref(false);


let mailPassword = ref("");
let mailPasswordError = ref(false);


let popPort = ref(143);
let popPortError = ref(false);


let smtpPort = ref(587);
let smtpPortError = ref(false);


let apiBaseUrl = ref("");
let apiBaseUrlError = ref(false);


let apiToken = ref("");
let apiTokenError = ref(false);


let userId = ref("");
let userIdError = ref(false);


// let useMl = ref(false);


let status = ref("");
let user = reactive({});

let submitDisabled = ref(false);

let getDepartment = (id) => {
  
  // This is a new ticket
  if (id == 0) {
    return;
  }

  axios
    .get(config.public.apiUrl + "/api/departments/" + id,
    {
      headers: {
        Authorization: "Bearer " + auth.access_token
      }
    })
    .then((response) => {

      console.log("department:");
      console.log(response);

      if (response.status == 200) {
        department.value        = response.data.department.department;
        signature.value         = response.data.department.signature;
        departmentEmail.value   = response.data.department.email_address;
        logoUrl.value           = response.data.department.logo_url;
        mailHost.value          = response.data.department.mail_host;
        mailUsername.value      = response.data.department.mail_username;
        mailPassword.value      = response.data.department.mail_password;
        popPort.value           = response.data.department.pop_port;
        smtpPort.value          = response.data.department.smtp_port;
        apiBaseUrl.value        = response.data.department.api_base_url;
        apiToken.value          = response.data.department.api_token;
        signature.value         = response.data.department.signature;
        userId.value            = response.data.department.user_id;

        var myEditor = document.querySelector('.js-quill')
        myEditor.children[0].innerHTML = signature.value;

      }

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
  

let createDepartment = async () => {

  try {

      var myEditor = document.querySelector('.js-quill')
      var html = myEditor.children[0].innerHTML

      const response = await axios.post(config.public.apiUrl + "/api/departments", {
        // message : html,
        // title   : title.value, 
        // department: department.value,
        // use_ml  : useMl.value,
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


  
  if (department.value == "") {
    departmentError.value = true;
    formErrors.value += "<li>Select a department</li>";
  }


  var myEditor = document.querySelector('.js-quill')
  var html = myEditor.children[0].innerHTML


  if (html == "" || html == "<p></p>" || html == "<p><br></p>") {
    messageError.value = true;
    formErrors.value += "<li>Signature cannot be blank</li>";
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

    // New Department
    createDepartment()
    .then((response) => {
      console.log("Response: ");
      console.log(response);
      if (response) {
        sweetalert({
          text:  "Saved",
          title: "Department saved",
          icon: "success",
          timer: 1500
        });

        router.push("/departments");
      }
    })
    .catch((error) => {
        console.error("Error creating ticket:", error);
    });



  } else {
    saveDepartment(id);
  }

};









let saveDepartment = (departmentId) => {
  
  var myEditor = document.querySelector('.js-quill')
  signature.value = myEditor.children[0].innerHTML





  if (useUpdateDepartment(
    departmentId,
    departmentEmail.value,
    department.value,
    signature.value,
    logoUrl.value,
    mailHost.value,
    mailUsername.value,
    mailPassword.value,
    popPort.value,
    smtpPort.value,
    apiBaseUrl.value,
    apiToken.value,
    auth.access_token,
    config.public.apiUrl
  )) {
    sweetalert({
      text:  "Saved",
      title: "Department updated",
      icon: "success",
      timer: 1500
    });

    router.push("/departments");
  }

};






onMounted(() => {

  getDepartment(id);
})







  let departments = ref([]);

  let getDepartments = () => {

    axios
      .get(config.public.apiUrl + "/api/departments",
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



  



  
let deleteDepartment = () => {


  sweetalert({
      text: "Really delete this department?",
      title: "Are you sure?",
      icon: "warning",      
      buttons: ["No, keep it!", "Yes, I am sure!"],
      dangerMode: true,
  }).then(function (isConfirm) {
      if (isConfirm) {
    
        if (useDeleteDepartment(id, auth.access_token, config.public.apiUrl)) {

          router.push("/departments");

          sweetalert({
            text:  "Department Deleted",
            title: "Deleted",
            icon: "success",
            timer: 1500
          });
        }

      } else {
      
          sweetalert({
              text: "Not deleting department...",
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

            <h1 class="page-header-title">New Department</h1>

            <div class="mt-5">
              <h7 class="text-muted">Department</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': departmentError
                }"
                v-model="department"
                @keydown="departmentError = false"
                placeholder="Department"
              >
            </div>


            <div class="mt-5">
              <h7 class="text-muted">Email</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': departmentEmailError
                }"
                v-model="departmentEmail"
                @keydown="departmentEmailError = false"
                placeholder="departmentEmail"
              >
            </div>

            <div class="mt-5">
              <h7 class="text-muted">Logo Url</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': logoUrlError
                }"
                v-model="logoUrl"
                @keydown="logoUrlError = false"
                placeholder="logoUrl"
              >
            </div>



            <div class="mt-5">
              <h7 class="text-muted">Mail Host</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': mailHostError
                }"
                v-model="mailHost"
                @keydown="mailHostError = false"
                placeholder="mailHost"
              >
            </div>




            <div class="mt-5">
              <h7 class="text-muted">Mail Username</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': mailUsernameError
                }"
                v-model="mailUsername"
                @keydown="mailUsernameError = false"
                placeholder="mailUsername"
              >
            </div>


            <div class="mt-5">
              <h7 class="text-muted">Mail Password</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': mailPasswordError
                }"
                v-model="mailPassword"
                @keydown="mailPasswordError = false"
                placeholder="mailPassword"
              >
            </div>



            <div class="mt-5">
              <div class="row">
                <div class="col-6">
                  <h7 class="text-muted">Pop Port</h7>
                  <input
                    type="number" 
                    class="form-control" 
                    :class="{
                    'error-border': popPortError
                    }"
                    v-model="popPort"
                    @keydown="popPortError = false"
                    placeholder="popPort"
                  >
              </div>                
              <div class="col-6">
                  <h7 class="text-muted">SMTP Port</h7>
                  <input
                    type="number" 
                    class="form-control" 
                    :class="{
                    'error-border': smtpPortError
                    }"
                    v-model="smtpPort"
                    @keydown="smtpPortError = false"
                    placeholder="smtpPort"
                  >
              </div>
            </div>
            </div>




            <div class="mt-5">
              <h7 class="text-muted"> API Base Url</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': apiBaseUrlError
                }"
                v-model="apiBaseUrl"
                @keydown="apiBaseUrlError = false"
                placeholder="apiBaseUrl"
              >
            </div>





            <div class="mt-5">
              <h7 class="text-muted">API Token</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': apiTokenError
                }"
                v-model="apiToken"
                @keydown="apiTokenError = false"
                placeholder="apiToken"
              >
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
          <h7 class="text-muted">signature</h7>

              <!-- Quill -->
              <div class="quill-custom">
                <div class="js-quill" style="height: 15rem;" data-hs-quill-options='{
                     "placeholder": "Type your signature...",
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
                @click="deleteDepartment"
              >
                <i class="bi-x-lg me-1"></i> Delete Department
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
                {{ !submitDisabled?"Save Department":"uploading..."}}
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