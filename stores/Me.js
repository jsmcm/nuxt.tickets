import { defineStore } from "pinia";
import { useAuth } from "./Auth";

export const useMe = defineStore({
  id: "me",

  state: () => ({
    email: "",
    name: "",
    level: 0,
    id: 0
  }),

  getters: {

    getUserId() {
      return () => {
        let auth = useAuth();

        let data = auth.loggedIn();

        if (data === false) {
          return false;
        }

        return data.sub;
      };
    },

    getUserName() {
      return () => {
        let auth = useAuth();

        let data = auth.loggedIn();

        if (data === false) {
          return "";
        }

        return this.name;
      };
    },


    getUserEmail() {
      return () => {
        let auth = useAuth();

        let data = auth.loggedIn();

        if (data === false) {
          return "";
        }

        return this.email;
      };
    },

    getUserLevel() {
      return () => {
        let auth = useAuth();

        let data = auth.loggedIn();

        if (data === false) {
          return "";
        }

        return this.level;
      };
    },
  },

  actions: {

    logout() {
 
      this.email = "";
      this.name = "";
      this.level = 0;
      this.id = 0;

    }
  },
  persist: {
    storage: persistedState.localStorage,
  },
  
});
