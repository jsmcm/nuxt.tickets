import { defineStore } from "pinia";

export let useConfig = defineStore("config", {
  state() {
    return {
      appUrl: "http://127.0.0.1:8000",
      apiUrl: "http://127.0.0.1:8000",
      siteName: "Support Tickets",
     
      // channelUrl: "http://channels.softsmart.co.za",
      // channelPort: 8443,
      
      /******************************
       * AWS STORAGE CREDENTIALS
       ****************************/
      // awsStorage: {
      //   bucket: "fluffykids",
      //   region: "af-south-1",
      // },
    };
  },

});
