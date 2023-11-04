<script setup>

let me = useMe();

let router = useRouter();

let keywordSearch = ref("");
let userSearch = ref("");

let searchKeyword = () => {

if (keywordSearch.value == "") {
  return;
}

router.push("/?searchTerm=" + keywordSearch.value + "&type=keyword");

};

let searchUser = () => {

if (userSearch.value == "") {
  return;
}

router.push("/?searchTerm=" + userSearch.value + "&type=user");

};


</script>


<template>

  <LayoutSiteMain>
      <!-- Content -->
      <div class="content container-fluid">
        <!-- Page Header -->
        <div class="page-header">
          <div class="row align-items-center mb-1">
            <div class="col-sm mb-2 mb-sm-0">
              <h1 class="page-header-title">Search Tickets</h1>
            </div>
            <!-- End Col -->
          </div>
          <!-- End Row -->
  
        </div>
        <!-- End Page Header -->
        
  
          <!-- Nav -->
          <ul v-if="me.getUserLevel() > 9" class="nav nav-pills mb-7" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" id="nav-one-eg2-tab" href="#nav-one-eg2" data-bs-toggle="pill" data-bs-target="#nav-one-eg2" role="tab" aria-controls="nav-one-eg2" aria-selected="true">
                <div>
                  <i class="bi-house"></i> Keyword Search
                </div>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="nav-two-eg2-tab" href="#nav-two-eg2" data-bs-toggle="pill" data-bs-target="#nav-two-eg2" role="tab" aria-controls="nav-two-eg2" aria-selected="false">
                <div>
                  <i class="bi-person"></i> Name / Email Search
                </div>
              </a>
            </li>
  
          </ul>
          <!-- End Nav -->
  
          <!-- Tab Content -->
          <div class="tab-content">
            <div class="tab-pane fade show active" id="nav-one-eg2" role="tabpanel" aria-labelledby="nav-one-eg2-tab">
              <p>Enter one or more keywords to search on. This will search both the message body and subject fields for matches.</p>
              
              <!-- Input Group -->
              <div class="mb-3">
  
                <div class="input-group input-group-merge">
                  <div class="input-group-prepend input-group-text">
                    <i class="bi-chat-right-dots"></i>
                  </div>
                  <input v-model="keywordSearch" type="text" class="form-control" placeholder="Keyword" aria-label="Keyword">
                </div>
              </div>
              
              <button 
                @click="searchKeyword"
                type="button"
                class="btn btn-primary btn-lg"
              >
              <i class="bi-search ms-1"></i> Search
              </button>
              
              <!-- End Input Group -->
  
  
            </div>
  
            <div class="tab-pane fade" id="nav-two-eg2" role="tabpanel" aria-labelledby="nav-two-eg2-tab">
              <p>Enter a name or email address to search on.</p>
                          
              <!-- Input Group -->
              <div class="mb-3">
  
                <div class="input-group input-group-merge">
                  <div class="input-group-prepend input-group-text">
                    <i class="bi-envelope"></i>
                  </div>
                  <input v-model="userSearch" type="text" class="form-control" placeholder="joe@example.com" aria-label="joe@example.com">
                </div>
              </div>
              
              
              <button
                @click="searchUser"
                type="button"
                class="btn btn-primary btn-lg"
              >
              <i class="bi-search ms-1"></i> Search
              </button>
              
              
              <!-- End Input Group -->
  
  
            </div>
          </div>
          <!-- End Tab Content -->
  
  
      </div>
      <!-- End Content -->
  
  </LayoutSiteMain>
   

</template>

