<script setup>
  
  import axios from "axios";
  import sweetalert from "sweetalert";

  let config = useRuntimeConfig();
  
  let auth = useAuth();

let departments = ref([]);

  onMounted(() => {
  
      useHead(() => {
          return {
              title: "SmartSupport.ai | Departments",
          }
      }); 


      axios.get(config.public.apiUrl + "/api/departments", {
        headers: {
          Authorization: "Bearer " + auth.access_token
        }
      })
      .then((response) => {
        console.log("response: ");
        console.log(response);
        departments.value = response.data.data;
        let set_cache = useSetWithExpiry("departments", response.data.replies, 86400000);

      })
      .catch((err) => {
        console.log("err: ");
        console.log(err);
      });


  });

let deleteDepartment = (departmentId) => {

  if (useDeleteDepartment(departmentId, auth.access_token, config.public.apiUrl)) {

    const indexToRemove = departments.value.findIndex(department => department.id == departmentId);

    if (indexToRemove > -1) {
      departments.value.splice(indexToRemove, 1);
      let set_cache = useSetWithExpiry("departments", departments.value, 86400000);
    }

    sweetalert({
      text:  "Department Deleted",
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
            <h1 class="page-header-title">Departments</h1>
          </div>
          <!-- End Col -->

          <div class="col-sm-auto">
            <NuxtLink class="btn btn-primary" to="/department/0">New Department</NuxtLink>
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
                <th>User</th>
                <th>Title</th>
                <th>Email Address</th>
                <th>Mail Host</th>
                <th>Imap Port</th>
                <th>SMTP Port</th>
                <th>Mail User</th>
              </tr>
            </thead>

            <tbody>

                <DepartmentsDepartment
                  @deleteDepartment="deleteDepartment"
                  v-for="department in departments"
                  :key="department.id"
                  :department="department"
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
