import { defineStore } from "pinia";

import VueJwtDecode from "vue-jwt-decode";


export const useAuth = defineStore({
  id: "auth",

  state: () => ({
    access_token: "",
    expires_in: 0,
    token_type: "",
  }),

  getters: {},

  actions: {
    logout() {
      this.access_token = "";
      this.expires_in = 0;
      this.token_type = "";
    },

    loggedIn() {
      if (this.access_token == "") {
        return false;
      }

      // console.log("accessToken: " + this.access_token);
      let check = VueJwtDecode.decode(this.access_token);

      let currentTime = Date.now() / 1000;

      let timeOver = parseInt(check.exp - currentTime);

      if (timeOver > 0) {
        return check;
      }

      return false;
    },
  },

  persist: {
    storage: persistedState.localStorage,
  },
  

});
