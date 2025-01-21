<script setup>

  let me = useMe();

</script>

<template>
<!-- Navbar Vertical -->

  <aside class="js-navbar-vertical-aside navbar navbar-vertical-aside navbar-vertical navbar-vertical-fixed navbar-expand-xl navbar-bordered bg-white  ">
    <div class="navbar-vertical-container">
      <div class="navbar-vertical-footer-offset">
        <!-- Logo -->

        <NuxtLink class="navbar-brand" to="/" aria-label="Front">
          <img class="navbar-brand-logo" src="@/assets/svg/logos/logo.svg" alt="Logo" data-hs-theme-appearance="default">
          <img class="navbar-brand-logo-mini" src="@/assets/svg/logos/logo-short.svg" alt="Logo" data-hs-theme-appearance="default">
        </NuxtLink>

        <!-- End Logo -->

        <!-- Navbar Vertical Toggle -->
        <button type="button" class="js-navbar-vertical-aside-toggle-invoker navbar-aside-toggler">
          <i class="bi-arrow-bar-left navbar-toggler-short-align" data-bs-template='<div class="tooltip d-none d-md-block" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>' data-bs-toggle="tooltip" data-bs-placement="right" title="Collapse"></i>
          <i class="bi-arrow-bar-right navbar-toggler-full-align" data-bs-template='<div class="tooltip d-none d-md-block" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>' data-bs-toggle="tooltip" data-bs-placement="right" title="Expand"></i>
        </button>

        <!-- End Navbar Vertical Toggle -->

        <!-- Content -->
        <div class="navbar-vertical-content">
          <div id="navbarVerticalMenu" class="nav nav-pills nav-vertical card-navbar-nav">


            <span class="dropdown-header mt-4">Tickets</span>
            <small class="bi-three-dots nav-subtitle-replacer"></small>

            <div class="nav-item">
              <NuxtLink class="nav-link" to="/" data-placement="left">
                <i class="bi-envelope nav-icon"></i>
                <span class="nav-link-title">Tickets</span>
              </NuxtLink>
            </div>


            <div class="nav-item">
              <NuxtLink class="nav-link " to="/search" data-placement="left">
                <i class="bi-search nav-icon"></i>
                <span class="nav-link-title">Search</span>
              </NuxtLink>
            </div>


            <div v-if="me.getUserLevel() >= 10" class="nav-item">
              <NuxtLink class="nav-link" to="/canned-replies" data-placement="left">
                <i class="bi-card-text nav-icon"></i>
                <span class="nav-link-title">Canned Replies</span>
              </NuxtLink>
            </div>

            <div v-if="me.getUserLevel() >= 10" class="nav-item">
              <NuxtLink class="nav-link" to="/departments" data-placement="left">
                <i class="bi-card-text nav-icon"></i>
                <span class="nav-link-title">Departments</span>
              </NuxtLink>
            </div>


            <div v-if="me.getUserLevel() >= 100" class="nav-item">
              <NuxtLink class="nav-link" to="/ml-canned-replies" data-placement="left">
                <i class="bi-cpu nav-icon"></i>
                <span class="nav-link-title">ML Canned Replies</span>
              </NuxtLink>
            </div>


            <div v-if="me.getUserLevel() >= 100" class="nav-item">
              <NuxtLink class="nav-link" to="/banned-emails" data-placement="left">
                <i class="bi-envelope-slash nav-icon text-danger"></i>
                <span class="nav-link-title">Banned Emails</span>
              </NuxtLink>
            </div>



          </div>

        </div>
        <!-- End Content -->

      </div>
    </div>
  </aside>
</template>