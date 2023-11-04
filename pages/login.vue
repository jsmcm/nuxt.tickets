<script setup>

// import Layout from "@/components/layout/front/Layout.vue";
import axios from "axios";
import sweetalert from "sweetalert";
import VueJwtDecode from 'vue-jwt-decode';

let router = useRouter();

let email = ref("");
let password = ref("");

let passwordType = ref("password");
let passwordClass = ref("bi-eye");

let config = useConfig();

// let VueJwtDecode = ref(null);

// onMounted(() => {
//   if (process.client) {
    // const module = import('vue-jwt-decode');
    // VueJwtDecode.value = module.VueJwtDecode || module.default;
//   }
// });




//let config = useConfig();

if (process.client) {
  document.title = "Login | Tickets";
}

let auth = useAuth();
let me = useMe();

// let loggedIn = auth.loggedIn() ? true : false;

// if (loggedIn) {
//   let router = useRouter();
//   router.push("/");
// }

// let newloggedIn = ref(false);

// let route = useRoute();

// let showAlert = false;
// let alertMessage = "";

let doLogin = () => {
  
 
  axios
    .post(config.apiUrl + "/api/auth/login", {
      email: email.value,
      password: password.value,
    })
    .then((response) => {
      console.log("response:");
      console.log(response);
      console.log("response.data:");
      console.log(response.data);

      let check = VueJwtDecode.decode(response.data.access_token);
      console.log("check: ");
      console.log(check);
      console.log("check.typ: ");
      console.log(check.typ);

      console.log("response.data.email: ");
      console.log(response.data.email);
      console.log("email: ");
      console.log(email);

      // if (check.typ == "JWT" && check.email == email) {
      if (check.typ == "JWT") {

        auth.access_token = response.data.access_token;
        auth.expires_in = response.data.expires_in;
        auth.token_type = response.data.token_type;

        if (response.data.email) {
          me.email = response.data.email;
        }

        // if (response.data.mobile) {
        //   me.mobile = response.data.mobile;
        // }

        if (response.data.id) {
          me.id = response.data.id;
        }

        if (response.data.level) {
          me.level = response.data.level;
        }

        if (response.data.name) {
          me.name = response.data.name;
        }



        sweetalert({
          text: "Successfully Logged In",
          title: "Logged In",
          icon: "success",
          timer: 2000,
        });

        
        setTimeout(() => {
          
        }, 2500);
        router.push("/");

        //loggedIn.value = true;
        return true;
      }
    })
    .catch((reason) => {
      
      //auth.logout();

      console.log("reason: ");
      console.log(reason.message);
      console.log("reason: ");
      console.log();

      let swalText = "";
      let swalTitle = "";

      if (reason.response.status == 401) {
        swalText =
          "You have entered an incorrect email or password.\r\n\r\nPlease try again or click on the 'Forgot Password' link on the login box.";
        swalTitle = "Incorrect Login";
      } else if (reason.response.status == 404) {
        swalText =
          "There is no user here with that email address.\r\n\r\nPlease register before trying to log in using the 'Register' button above";
        swalTitle = "User Does Not Exist";
      } else {
        swalText =
          "We've encountered and error. Please wait 5 minutes then try again.";
        swalTitle = "Oops, that's an error";
      }

      sweetalert({
        text: swalText,
        title: swalTitle,
        icon: "error",
        timer: 10000,
      });
    });


};


// let isLogged = computed(() => {
//   return newloggedIn.value;
// });



let togglePassword = () => {
    if (passwordType.value == "password") {
        passwordType.value = "text";
        passwordClass.value = "bi-eye-slash";
    } else if (passwordType.value == "text") {
        passwordType.value = "password";
        passwordClass.value = "bi-eye";
    }
};


</script>


<template>
    
  <!-- ========== MAIN CONTENT ========== -->
  <main id="content" role="main" class="main">
    <div class="position-fixed top-0 end-0 start-0 bg-img-start" style="height: 32rem; background-image: url(/assets/svg/components/card-6.svg);">
      <!-- Shape -->
      <div class="shape shape-bottom zi-1">
        <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1921 273">
          <polygon fill="#fff" points="0,273 1921,273 1921,0 " />
        </svg>
      </div>
      <!-- End Shape -->
    </div>

    <!-- Content -->
    <div class="container py-5 py-sm-7">
      <a class="d-flex justify-content-center mb-5" href="/login">
        <img class="zi-2" src="@/assets/svg/logos/logo.svg" alt="Image Description" style="width: 8rem;">
      </a>

      <div class="mx-auto" style="max-width: 30rem;">
        <!-- Card -->
        <div class="card card-lg mb-5">
          <div class="card-body">
            <!-- Form -->
            <div class="js-validate needs-validation">
              <div class="text-center">
                <div class="mb-5">
                  <h1 class="display-5">Log In</h1>
                  <p>Don't have an account yet? <a class="link" href="/register">Register</a></p>
                </div>

              </div>

              <!-- Form -->
              <div class="mb-4">
                <label class="form-label" for="signinSrEmail">Your email</label>
                <input
                  type="email"
                  class="form-control form-control-lg"
                  id="signinSrEmail"
                  tabindex="1"
                  placeholder="email@address.com"
                  aria-label="email@address.com"
                  required
                  v-model="email"
                >
                <span class="invalid-feedback">Please enter a valid email address.</span>
              </div>
              <!-- End Form -->

              <!-- Form -->
              <div class="mb-4">
                <label class="form-label w-100" for="signupSrPassword" tabindex="0">
                  <span class="d-flex justify-content-between align-items-center">
                    <span>Password</span>
                    <NuxtLink class="form-label-link mb-0" to="/reset-password">Forgot Password?</NuxtLink>
                  </span>
                </label>

                <div class="input-group input-group-merge" data-hs-validation-validate-class>
                  <input
                    :type="passwordType"
                    class="form-control form-control-lg"
                    v-model="password"
                    id="signupSrPassword"
                    placeholder="8+ characters required"
                    aria-label="8+ characters required"
                    required
                    minlength="8"
                  >

                    <button
                        type="button"
                        class="input-group-append input-group-text"
                        @click="togglePassword"
                    >
                        <i :class="passwordClass"></i>
                    </button>

                </div>

                <span class="invalid-feedback">Please enter a valid password.</span>
              </div>
              <!-- End Form -->

              <div class="d-grid">
                <button @click="doLogin" class="btn btn-primary btn-lg">Log in</button>
              </div>
            </div>
            <!-- End Form -->
          </div>
        </div>
        <!-- End Card -->

 
      </div>
    </div>
    <!-- End Content -->
  </main>
</template>
