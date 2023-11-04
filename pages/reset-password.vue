<template>
  <main id="content" role="main" class="main">
    <div class="position-fixed top-0 end-0 start-0 bg-img-start" style="height: 32rem; background-image: url(./assets/svg/components/card-6.svg);">
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
      <a class="d-flex justify-content-center mb-5" href="./index.html">
        <img class="zi-2" src="@/assets/svg/logos/logo.svg" alt="Image Description" style="width: 8rem;">
      </a>

      <div class="mx-auto" style="max-width: 30rem;">
        <!-- Card -->
        <div class="card card-lg mb-5">
          <div class="card-body">
            <!-- Form -->
            <form class="js-validate needs-validation" novalidate>
              <div class="text-center">
                <div class="mb-5">
                  <h1 class="display-5">Forgot password?</h1>
                  <p>Enter the email address you used when you joined and we'll send you instructions to reset your password.</p>
                </div>
              </div>

              <!-- Form -->
              <div class="mb-4">
                <label class="form-label" for="resetPasswordSrEmail" tabindex="0">Your email</label>

                <input type="email" class="form-control form-control-lg" name="email" id="resetPasswordSrEmail" tabindex="1" placeholder="Enter your email address" aria-label="Enter your email address" required>
                <span class="invalid-feedback">Please enter a valid email address.</span>
              </div>
              <!-- End Form -->

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg">Submit</button>

                <div class="text-center">
                  <a class="btn btn-link" href="/login">
                    <i class="bi-chevron-left"></i> Back to Log In
                  </a>
                </div>
              </div>
            </form>
            <!-- End Form -->
          </div>
        </div>
        <!-- End Card -->

      </div>
    </div>
    <!-- End Content -->
  </main>
  
  </template>