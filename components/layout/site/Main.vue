<script setup>

    import { useAuth } from "@/stores/Auth";


    let auth = useAuth();

    let loggedIn = auth.loggedIn() ? true : false;

    if (!loggedIn) {
        let router = useRouter();
        router.push("/login");
    }


    useHead({
        bodyAttrs: {
            class: 'has-navbar-vertical-aside navbar-vertical-aside-show-xl footer-offset'
        }
    })

    onMounted(() => {

        if (typeof HSSideNav === 'function') {
            new HSSideNav('.js-navbar-vertical-aside').init();
        }

    });

</script>

<template>

    <LayoutSiteHeader />
  
    <!-- ========== MAIN CONTENT ========== -->
    <LayoutSiteSideNav />
  
    <main id="content" role="main" class="main">

        <slot />

     <LayoutSiteFooter />
     
    </main>
    <!-- ========== END MAIN CONTENT ========== -->
  
</template>

