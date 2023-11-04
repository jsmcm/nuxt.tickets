<script setup>

let route = useRoute();
let me = useMe();

onMounted(() => {

      useHead(() => {
          return {
              title: "SmartSupport.ai | Ticket List",
          }
      }); 

  });


</script>

<template>

  <LayoutSiteMain>
     

   <!-- Content -->
   <div class="content container-fluid">
      <!-- Page Header -->
      <div class="page-header">
        <div class="row align-items-center mb-1">
          <div class="col-sm mb-2 mb-sm-0">
            <h1 class="page-header-title">Support Tickets</h1>
            <h4 v-if="route.query.searchTerm && route.query.searchTerm!=''" class="text-muted">Searching: {{ route.query.searchTerm }}</h4>
			
          </div>
          <!-- End Col -->

          <div v-if="me.getUserLevel() > 9" class="col-sm-auto">
            <NuxtLink class="btn btn-primary" to="/ticket/0">New Ticket</NuxtLink>
          </div>
          <!-- End Col -->
        </div>
        <!-- End Row -->

      </div>
      <!-- End Page Header -->

      <TicketsList v-if="!route.query.searchTerm" />
      <TicketsListKeyword v-else-if="route.query.type=='keyword'" :searchTerm="route.query.searchTerm" />
      <TicketsListUser v-else-if="route.query.type=='user'" :searchTerm="route.query.searchTerm" />
      
    </div>
    <!-- End Content -->


  </LayoutSiteMain>
   

</template>

