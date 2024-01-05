import { defineStore } from "pinia";

export const useUserStore = defineStore("staff", {
  state: () => {
    return {
      name: "",
      role: "",
      department: "",
      signInTimes: [],
    };
  },
});
