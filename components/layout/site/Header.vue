<script setup>

import VueJwtDecode from "vue-jwt-decode";

import axios from "axios";
let config = useRuntimeConfig();

let auth = useAuth();
let me = useMe();
let router = useRouter();

let email = computed(() => {
  return me.getUserEmail();
});


let userType = computed(() => {
  if (me.getUserLevel() >= 100) {
    return "Super User";
  } else if (me.getUserLevel() >= 50) {
    return "Admin";
  } else if (me.getUserLevel() >= 10) {
    return "Site Owner";
  } else if (me.getUserLevel() >= 0) {
    return "Client";
  }
});



let name = computed(() => {
  return me.getUserName();
});


let signOut = () => {

  axios
    .post(config.public.apiUrl + "/api/auth/logout", {},
    {
        headers: {
          Authorization: "Bearer " + auth.access_token,
        }
      })
    .then((response) => {
      me.logout();
      auth.logout();

      router.push("/login");
    })
    .catch((error) => {
      
        console.log("error: ");
        console.log(error);
      
        if (error.request.status == 401) {
          // already logged out on the backend
          me.logout();
          auth.logout();

          router.push("/login");
        }
    });


};

</script>


<template>
    
    <!-- ========== HEADER ========== -->

    <header id="header" class="navbar navbar-expand-lg navbar-fixed navbar-height navbar-container navbar-bordered bg-white">
    <div class="navbar-nav-wrap">
      <!-- Logo -->
      <NuxtLink class="navbar-brand" to="/" aria-label="Tickets">
        <img class="navbar-brand-logo" src="@/assets/svg/logos/logo.svg" alt="Tickets" data-hs-theme-appearance="default">
        <img class="navbar-brand-logo-mini" src="@/assets/svg/logos/logo-short.svg" alt="Tickets" data-hs-theme-appearance="default">
      </NuxtLink>
      <!-- End Logo -->

      <div class="navbar-nav-wrap-content-start">
        <!-- Navbar Vertical Toggle -->
        <button type="button" class="js-navbar-vertical-aside-toggle-invoker navbar-aside-toggler">
          <i class="bi-arrow-bar-left navbar-toggler-short-align" data-bs-template='<div class="tooltip d-none d-md-block" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>' data-bs-toggle="tooltip" data-bs-placement="right" title="Collapse"></i>
          <i class="bi-arrow-bar-right navbar-toggler-full-align" data-bs-template='<div class="tooltip d-none d-md-block" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>' data-bs-toggle="tooltip" data-bs-placement="right" title="Expand"></i>
        </button>

        <!-- End Navbar Vertical Toggle -->
      </div>

      <div class="navbar-nav-wrap-content-end">
        <!-- Navbar -->
        <ul class="navbar-nav">

          <li class="nav-item">
            <!-- Account -->
            <div class="dropdown">
              <a class="navbar-dropdown-account-wrapper" href="javascript:;" id="accountNavbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation>
                <div class="avatar avatar-sm avatar-circle">
                  <img class="avatar-img" src="@/assets/img/160x160/img1.jpg" :alt="name">
                </div>
              </a>

              <div class="dropdown-menu dropdown-menu-end navbar-dropdown-menu navbar-dropdown-menu-borderless navbar-dropdown-account" aria-labelledby="accountNavbarDropdown" style="width: 16rem;">
                <div class="dropdown-item-text">
                  <div class="d-flex align-items-center">
                    <div class="avatar avatar-sm avatar-circle">
                      <img class="avatar-img" src="@/assets/img/160x160/img1.jpg" :alt="name">
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h5 class="mb-1">{{ name }}</h5>
                      <p class="card-text text-body mb-1">{{ email }}</p>
                      <p class="card-text text-body">{{ userType }}</p>
                    </div>
                  </div>
                </div>

                <div class="dropdown-divider"></div>
				
                <button class="dropdown-item" @click="signOut">Sign out</button>
              </div>
            </div>
            <!-- End Account -->
          </li>
        </ul>
        <!-- End Navbar -->
      </div>
    </div>
  </header>

  <!-- ========== END HEADER ========== --> 
</template>

