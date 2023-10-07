export const userRegistrationToast = (type: string) => {
  const toast = useToast();
  const props = {
    timeout: 2000,
    ui: {
      progress: {
        background: "",
      },
    },
  };

  const removeError = () => {
    toast.remove("error");
  };

  const removeSuccess = () => {
    toast.remove("success");
  };

  if (type === "success") {
    toast.add({
      id: "success",
      title: "Registration successful!",
      description: "You can now login to your account.",
      color: "green",
      icon: "i-heroicons-check-circle",
      timeout: props.timeout,
      ui: props.ui,
      callback: removeSuccess,
    });
  } else if (type === "error") {
    toast.add({
      id: "error",
      title: "Registration failed!",
      description: "Please try again.",
      color: "red",
      icon: "i-heroicons-x-circle",
      timeout: props.timeout,
      ui: props.ui,
      callback: removeError,
    });
  }
};

export const userLoginToast = (type: string) => {
  const toast = useToast();
  const props = {
    timeout: 2000,
    ui: {
      progress: {
        background: "",
      },
    },
  };

  const removeError = () => {
    toast.remove("error");
  };

  const removeSuccess = () => {
    toast.remove("success");
  };

  if (type === "success") {
    toast.add({
      id: "success",
      title: "Login successful!",
      color: "green",
      icon: "i-heroicons-check-circle",
      timeout: props.timeout,
      ui: props.ui,
      callback: removeSuccess,
    });
  } else if (type === "error") {
    toast.add({
      id: "error",
      title: "An Error Occured!",
      description: "Please try again.",
      color: "red",
      icon: "i-heroicons-x-circle",
      timeout: props.timeout,
      ui: props.ui,
      callback: removeError,
    });
  }
};
