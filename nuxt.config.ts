// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //devtools: { enabled: true },

    ssr: true,


    app: {
        head: {
            script: [
                //{ src: "/js/hs.theme-appearance.js" , body: true },
                { src: "/vendor/bootstrap/dist/js/bootstrap.bundle.min.js", body: true},
                { src: "/vendor/hs-navbar-vertical-aside/dist/hs-navbar-vertical-aside.min.js", body: true},
                { src: "/js/theme.min.js", body: true },
                { src: "/vendor/quill/dist/quill.min.js", body: true },
             ],

            // link: [
            //     {
            //       rel: 'preload',
            //       href: '/assets/css/theme.min.css',
            //       'data-hs-appearance': 'default',
            //       as: 'style',
            //     },
            // ],
              
        }
    },

    runtimeConfig: {
        public: {
            appUrl      : process.env.APP_URL,
            apiUrl      : process.env.API_URL,
        }
    },

    modules: [
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        //'nuxt-socket-io',        
    ],



    css: [
        //"~/node_modules/bootstrap/dist/css/bootstrap.min.css",
        "~/public/vendor/bootstrap-icons/font/bootstrap-icons.css",
        "~/assets/css/theme.min.css",
    ],

    imports: {
        dirs: [
            'stores',
        ]
    }


})
