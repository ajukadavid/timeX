export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    if (to.path === "/dashboardEmployer" || to.path === "/dashboardStaff") {
      const token = localStorage.getItem("token");
      if (!token) {
        return navigateTo("/login");
      }
    }
  }
});
