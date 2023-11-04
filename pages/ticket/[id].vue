<script setup>
  
  import "~/public/vendor/quill/dist/quill.snow.css";

  import Dropzone from "dropzone";
  import axios from "axios";
  import sweetalert from "sweetalert";

  let config = useConfig();

  let router = useRouter();

  let { id } = useRoute().params;
  let myDropzone = null;

  let mergeTicketNumber = ref(0);
  let auth = useAuth();
  let me = useMe();

  let canned_replies = ref([]);

  onMounted(() => {
      HSCore.components.HSQuill.init('.js-quill');

      useHead(() => {
          return {
              title: "SmartSupport.ai | Ticket",
          }
      }); 

      myDropzone = new Dropzone(".dropzone2",
    {
      url: config.apiUrl + "/api/attachment",
      previewTemplate:'<div class="col h-100 mb-4">    <div class="dz-preview dz-file-preview">      <div class="d-flex justify-content-end dz-close-icon">        <small class="bi-x" data-dz-remove></small>      </div>      <div class="dz-details d-flex">        <div class="dz-img flex-shrink-0">         <img class="img-fluid dz-img-inner" data-dz-thumbnail>        </div>        <div class="dz-file-wrapper flex-grow-1">         <h7 class="dz-filename">          <span class="dz-title" data-dz-name></span>         </h7>         <div class="dz-size" data-dz-size></div>        </div>      </div>      <div class="dz-progress progress">        <div class="dz-upload progress-bar bg-success" role="progressbar" style="width: 0" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div>      </div>      <div class="d-flex align-items-center">        <div class="dz-success-mark">          <span class="bi-check-lg"></span>        </div>        <div class="dz-error-mark">          <span class="bi-x-lg"></span>        </div>        <div class="dz-error-message">          <small data-dz-errormessage></small>        </div>      </div>    </div></div>',
      thumbnailWidth:300,
      thumbnailHeight:300,

      sending: function(file, xhr, formData) {
        // Add the identifier of this Dropzone instance to the formData
        // console.log("file: ", file);
        // console.log("file: ", file.upload);
        // console.log("file: ", file.upload.uuid);

        formData.append("uuid", file.upload.uuid);
        formData.append("dropzoneId", ticketRandom);
        //formData.append("ticket_id", id);

        //console.log("created_at: ", ticket.value);
        //formData.append("ticket_date", ticket.value.created_at);
      },
  
  //    maxFilesize: "5",
  //    addRemoveLinks: true
  });


  myDropzone.on("addedfile", file => {
    submitDisabled.value = true;
  });


  
  myDropzone.on("queuecomplete", () => {
    submitDisabled.value = false;
  });

    myDropzone.on("reset", () => {
    submitDisabled.value = false;
  });


      getTicket(id);

      getDepartments();




  });



const now = new Date();

const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // month is zero-indexed
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

let ticketRandom = year + month + day + "_" + hours + minutes + seconds + "_" + generateRandomString(48);


let uploadExpanded = ref(false);

let formErrors = ref("");

// let config = useConfig();
let ticket = ref([]);
let threads = ref([]);
let subject = ref("");
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

let emailError = ref(false);
let clientNameError = ref(false);

let department = ref("");
let departmentId = ref(0);
let departmentError = ref(false);

let messageError = ref(false);
let status = ref("");
let user = reactive({});

let submitDisabled = ref(false);

let getTicket = (id) => {
  
  // This is a new ticket
  if (id == 0) {
    return;
  }

  axios
    .get(config.apiUrl + "/api/tickets/" + id,
    {
      headers: {
        Authorization: "Bearer " + auth.access_token
      }
    })
    .then((response) => {

      console.log("response:");
      console.log(response);
      ticket.value = response.data.data;
      user = response.data.data.user;
      threads.value = response.data.data.thread;
      subject.value = response.data.data.subject;
      status.value = response.data.data.status;
      department.value = response.data.data.department;
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
  

let validateMergeId = ticketId => {

    if (ticketId == "") {
      return {
        status: false,
        text: "Number field cannot be blank"
      }
    }

    if (isNaN(ticketId)) {
      return {
        status: false,
        text: "Number field must be a number"
      }
    }

    if (ticketId == id) {
      return {
        status: false,
        text: "Cannot merge with self."
      }
    }

    return true;
    
}


let merge = () => {
  
  let result = validateMergeId(mergeTicketNumber.value);
  if (result !== true) {
    sweetalert({
    
      text: result.text,
      title: "Error!",
      icon: "error",  
      timer: 3500
    });

    return false;

  }


  axios
  .patch(config.apiUrl + "/api/tickets/merge/" + id,
  {
    ticket_id: mergeTicketNumber.value
  },
  {
    headers: {
      Authorization: "Bearer " + auth.access_token,
    }
  })
  .then((response) => {

    console.log("response: ");
    console.log(response);
      if (response.status == 200) {

        sweetalert({
    
          text: "Tickets have been merged and you are now on the merged ticket",
          title: "Tickets Merged",
          icon: "success",      
          timer: 3500
        })

        router.push("/ticket/" + mergeTicketNumber.value );
        return true;
      }
    
  })
  .catch((error) => {
    
      // console.log("error 1: ");
      // console.log(error);
    
  });

  
}


let createTicket = async () => {

  try {
      const response = await axios.post(config.apiUrl + "/api/tickets/", {
          email: email.value,
          firstName: clientName.value,
          departmentId: department.value.id,
          subject: subject.value,
          priority: "normal",
      });

      // console.log("response:", response);

      if (response.status === 200) {
          const ticketId = response.data.data;
          return ticketId;
      } else {
          // console.error("Non-200 response status:", response.status);
          return null; // or throw an error, or handle differently as per your use case
      }

  } catch (error) {
      // console.error("error:", error);
      throw error; // or return null, or handle differently as per your use case
  }
}




let errors = () => {

  formErrors.value = "";


  if (id == 0) {

    // new ticket
    if (clientName.value == "") {
      clientNameError.value = true;
      formErrors.value += "<li>Client name cannot be blank</li>";
    }


    if (email.value == "") {
      emailError.value = true;
      formErrors.value += "<li>Email cannot be blank</li>";
    }

    if (subject.value == "") {
      subjectError.value = true;
      formErrors.value += "<li>Subject cannot be blank</li>";
    }


    
    if (department.value == "") {
      departmentError.value = true;
      formErrors.value += "<li>Select a department</li>";
    }


    

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








let doDeleteTicket = () => {

//console.log("closeTicket " + id);
axios
.delete(config.apiUrl + "/api/ticket/" + id,
{
  headers: {
    Authorization: "Bearer " + auth.access_token,
  }
})
.then((response) => {

  // console.log("response: ");
  // console.log(response);
    if (response.status == 200 && response.data.status == "success") {
      return true;
    }
  
})
.catch((error) => {
  
    // console.log("error 1: ");
    // console.log(error);
  
});

return false;

}




let deleteTicket = () => {


sweetalert({
  
  text: "Really delete this ticket?",
  title: "Are you sure?",
  icon: "warning",      
  buttons: ["No, keep it open!", "Yes, I am sure!"],
  dangerMode: true,

}).then(function (isConfirm) {
  if (isConfirm) {
   
    doDeleteTicket();
    router.push("/");

  } else {
   
    sweetalert({
  
      text: "Not deleting ticket...",
      title: "Not deleting",
      icon: "success",  
      timer: 3500
    });


  }
});

};























let closeTicket = () => {

  //console.log("closeTicket " + id);

axios
  .patch(config.apiUrl + "/api/ticket/" + id,
  {
    status: 'closed'
  },
  {
    headers: {
      Authorization: "Bearer " + auth.access_token,
    }
  })
  .then((response) => {

    // console.log("response: ");
    // console.log(response);
      if (response.status == 200 && response.data.status == "success") {
        return true;
      }
    
  })
  .catch((error) => {
    
      // console.log("error 1: ");
      // console.log(error);
    
  });

  return false;

}




let close = () => {


  sweetalert({
    
    text: "Really close this ticket?",
    title: "Are you sure?",
    icon: "warning",      
    buttons: ["No, keep it open!", "Yes, I am sure!"],
    dangerMode: true,

  }).then(function (isConfirm) {
    if (isConfirm) {
     
      closeTicket();
      router.push("/");

    } else {
     
      sweetalert({
    
        text: "Not closing ticket...",
        title: "Not closing",
        icon: "success",  
        timer: 3500
      });


    }
  });

};




let save = () => {

  if (errors() === true) {
    return;
  }

  if (id == 0) {

    // New Ticket
    createTicket().then(ticketId => {

      if ( (!isNaN(ticketId)) && (ticketId > 0)) {
        saveThread(ticketId, true);
      }

    }).catch(error => {
        console.error("Error creating ticket:", error);
    });



  } else {
    saveThread(id);
  }

};








/**
 * Skip email is a flag used to skip sending the new message notifaction from the backend.
 * We use this flag for new tickets because the ticket itself generates a notice that 
 * we've received their email. Only on subsequent messages do we need to email
 */
let saveThread = (ticketId, skipEmail=false) => {

var myEditor = document.querySelector('.js-quill')
var html = myEditor.children[0].innerHTML

axios
.post(config.apiUrl + "/api/thread/" + ticketId, {
    message       : html,
    type          : replyType.value,
    randomString  : ticketRandom,
    skipEmail     : skipEmail

  },
  {
      headers: {
        Authorization: "Bearer " + auth.access_token,
    }
  }
)
.then((response) => {
  
  console.log("response: ");
  console.log(response);

  if (response.status == 200) {

    if (id == 0) {
      // this was a new ticket, redirect to created ticket
      router.push("/ticket/" + ticketId);
      return;
    }

    console.log("pre:");
    console.log(threads);
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // month is zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // we need a data which doesn't come through with the correct label..
    response.data.thread.date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    threads.value.push(response.data.thread);


    myEditor.children[0].innerHTML = "";

    myDropzone.removeAllFiles();

    setTimeout(() => {
      const el = document.getElementById(response.data.thread.id);
    el.scrollIntoView({ behavior: 'smooth' });
    },50);



  }

})
.catch((error) => {
  
    console.log("error: ");
    console.log(error);
  
});


};



let messageType = () => {

  if (replyType.value == "to-client" || replyType.value == "from-client") {
    replyType.value = "internal-note";
  } else {

    if (me.getUserLevel() < 10) {
      replyType.value = "from-client";
    } else {
      replyType.value = "to-client";
    }
  }
};

let replyType = ref("to-client");
if (me.getUserLevel() < 10) {
  replyType.value = "from-client";
}


function generateRandomString(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}



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

        // console.log("departments: ");
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
  

  let cannedReply = ref("");
  let useCannedReply = (data, values) => {
      
    let cannedReplyText = canned_replies.value.reduce((accumulator, currentValue) => {
      if (currentValue.slug == cannedReply.value) {
        return currentValue;
      } else {
        return accumulator;
      }
    });


    var myEditor = document.querySelector('.js-quill')
    myEditor.children[0].innerHTML = cannedReplyText.message;

  };



  watch(departmentId, (newValue) => {
    department.value = departments.value.reduce((accumulator, currentValue) => {
      if (currentValue.id == departmentId.value) {
        return currentValue;
      }
      return accumulator;
    })
  });


  watch(department, (newValue) => {
    let allCannedReplies = useGetWithExpiry("canned_replies");
    canned_replies.value = allCannedReplies.filter(reply => reply.department_id == department.value.id);
  });


</script>

<template>

  <LayoutSiteMain>
    <!-- Content -->
    <div class="content container-fluid">
      <!-- Page Header -->
      <div class="page-header">
        <div class="row align-items-end">
          <div class="col-sm mb-2 mb-sm-0" v-if="id>0">

            <h7 class="text-muted">Ticket #{{ id }} - {{ status }}</h7>
            <h1 class="page-header-title">{{ subject }}</h1>
            <h4 class="text-muted">{{ user.email }}</h4>
			
          </div>

          <div class="col-sm mb-2 mb-sm-0" v-else>

            <h1 class="page-header-title">New Ticket</h1>

            <div v-if="me.getUserLevel() > 49" class="mt-5">
              <h7 class="text-muted">Email</h7>
              <input
                type="email" 
                class="form-control" 
                :class="{
                'error-border': emailError
                }"
                v-model="email"
                @keydown="emailError = false"
                placeholder="joe@example.com"
              >
            </div>


            <div v-if="me.getUserLevel() > 49" class="mt-5">
              <h7 class="text-muted">Client Name</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': clientNameError
                }"
                v-model="clientName"
                @keydown="clientNameError = false"
                placeholder="Joe Black"
              >
            </div>


            <div class="mt-5">
              <h7 class="text-muted">Subject</h7>
              <input
                type="text" 
                class="form-control" 
                :class="{
                'error-border': subjectError
                }"
                v-model="subject"
                @keydown="subjectError = false"
              >
            </div>


            <div class="mt-5">
              <h7 class="text-muted">Department</h7>
              <select
                type="text" 
                class="form-select" 
                :class="{
                'error-border': departmentError
                }"
                v-model="departmentId"
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
		
	
		<div class="row align-items-end" v-if="id>0">

          <div v-if="me.getUserLevel() > 9" class="col-sm-auto d-grid">
            <button class="btn btn-danger" @click="deleteTicket">
              <i class="bi-x-lg me-1"></i> Delete Ticket
            </button>
          </div>
		  
          <div v-if="me.getUserLevel() > 49" class="col-sm-auto mt-3 d-grid">
            <a class="btn btn-danger" href="./users-add-user.html">
              <i class="bi-slash-circle me-1"></i> Delete Ticket and Ban Sender
            </a>
          </div>
		  
          <div class="col-sm-auto mt-3 d-grid">
            <button
              class="btn btn-warning"
              @click="close"
            >
              <i class="bi-toggle-off me-1"></i> Close Ticket
            </button>
          </div>	
		  
          <div v-if="me.getUserLevel() > 9" class="col-sm-auto mt-3 d-grid">
            <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#ticketMergeModal">
              <i class="bi-inboxes me-1"></i> Merge Ticket
            </button>
          </div>
		  
		  
          <!-- End Col -->
        </div>
        <!-- End Row -->

      </div>
      <!-- End Page Header -->


      <TicketMessages v-if="id>0" :threads="threads"/>

      <div class="row">
        <div class="col-lg-12 mb-3 mb-lg-0">
          <!-- Card -->
          <div class="card mb-3 mb-lg-5 border border-2">
            <!-- Header -->
            <div :class="'bg-' + ((replyType=='to-client' || replyType=='from-client')?'danger':'info')" class="card-header d-flex justify-content-between">

              <div>
                <h4 class="card-header-title text-white">Add {{ newThreadTitle }}</h4>
              </div>

              <div v-if="me.getUserLevel() > 9">

                <select
                  @change="useCannedReply"
                  class="form-select form-select-sm bg-transparent text-white border-white"
                  v-model="cannedReply"
                >
                  <option value="" :key="-1">Canned Reply</option>
                  <option v-for="canned_reply in canned_replies" :key="canned_reply.id" :value="canned_reply.slug">{{ canned_reply.title }}</option>
                </select>
              </div>

              <div v-if="me.getUserLevel() > 9" class="form-check form-switch form-switch-between">
                <label class="form-check-label text-white">{{ (replyType== "internal-note")?"Make ":"" }} Reply</label>
                <input @change="messageType" type="checkbox" class="form-check-input" :class="'bg-' + ((replyType=='to-client' || replyType=='from-client')?'info':'danger')">
                <label class="form-check-label text-white">{{ (replyType== "to-client" || replyType=='from-client')?"Make ":"" }} Internal Note</label>
              </div>



            </div>
            <!-- End Header -->

            <!-- Body -->
            <div
              class="card-body"
              :class="{
                'error-border': messageError
              }"
            >
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
            </div>
            <!-- Body -->



            <div class="card-header card-header-content-between">
              <h4
                class="card-header-title"
                id="uploads"
                @click="uploadExpanded = !uploadExpanded"
              >Uploads</h4>
              <span>
                <button
                  v-if="uploadExpanded==true"
                  class="no-button"
                  title="minimize uploads"
                  @click="uploadExpanded = !uploadExpanded"
                >
                  <i class="bi bi-arrows-angle-contract"></i>
                </button>
                <button
                  v-if="uploadExpanded==false"
                  class="no-button"
                  title="expand uploads"
                  @click="uploadExpanded = !uploadExpanded"
                >
                  <i class="bi bi-arrows-fullscreen"></i>
                </button>
              </span>
            </div>
            <!-- End Header -->


            <!-- Body -->
            <div
              class="card-body"
              :style="(uploadExpanded==true)?'display:inline':'display:none;'"
            >
              <!-- Dropzone -->
              <form enctype="multipart/form-data" class="dropzone2 dz-dropzone dz-dropzone-card">
                <div class="dz-message">
                  <img class="avatar avatar-xl avatar-4x3 mb-3" src="@/assets/svg/illustrations/oc-browse.svg" alt="Image Description" data-hs-theme-appearance="default">

                  <h5>Drag and drop your file(s) here</h5>

                  <p class="mb-2">or</p>

                  <span class="btn btn-white btn-sm">Browse files</span>
                </div>
              </form>
              <!-- End Dropzone -->
            </div>
            <!-- Body -->
          </div>



            <div
              class="mb-3 mb-lg-5 d-flex justify-content-end align-items-center gap-3"
            >
                            
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
                {{ !submitDisabled?"Send Message":"uploading..."}}
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
   

  <!-- Modal -->
  <div class="modal fade" id="ticketMergeModal" tabindex="-1" role="dialog" aria-labelledby="ticketMergeModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        
        <div class="modal-header">
          <h5 class="modal-title" id="ticketMergeModalLabel">Merge Tickets</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
          <label for="mergeTicketNumber">Merge with Ticket Number:</label>
          <input id="mergeTicketNumber" v-model="mergeTicketNumber" type="number" class="form-control">
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-white" data-bs-dismiss="modal">Cancel</button>
          <button @click="merge" type="button" data-bs-dismiss="modal" class="btn btn-primary">Merge</button>
        </div>

      </div>
    </div>
  </div>
  <!-- End Modal -->


</template>


<style>

select option {
  color: #111111;
}

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