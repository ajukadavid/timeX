import { defineStore } from "pinia";

export const useUserStore = defineStore("staff", {
  state: () => {
    return {
      name: "",
      userRole: "",
      department: "",
      signInTimes: [],
    };
  },
});
