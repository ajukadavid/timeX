function concatenateValues(input: any[]): string {
  return input
    .map((item) => {
      if (typeof item === "string") {
        return item;
      } else if (typeof item === "object" && "message" in item) {
        return item.message;
      } else {
        return "";
      }
    })
    .join(", ");
}

export const userRegistrationToast = (errArr: any[], code?: number) => {
  const msg = concatenateValues(errArr);
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
  if (msg === "success" || code === 200) {
    toast.add({
      id: "success",
      title: msg,
      color: "green",
      icon: "i-heroicons-check-circle",
      timeout: props.timeout,
      ui: props.ui,
      callback: removeSuccess,
    });
  } else if (msg === "error" || code !== 200) {
    toast.add({
      id: "error",
      title: msg,
      description: "Registration failed!",
      color: "red",
      icon: "i-heroicons-x-circle",
      timeout: props.timeout,
      ui: props.ui,
      callback: removeError,
    });
  }
};

export const userLoginToast = (errArr: any[], code?: number) => {
  const msg = concatenateValues(errArr);
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
  if (msg === "success" || code === 200) {
    toast.add({
      id: "success",
      title: msg,
      color: "green",
      icon: "i-heroicons-check-circle",
      timeout: props.timeout,
      ui: props.ui,
      callback: removeSuccess,
    });
  } else if (msg === "error" || code !== 200) {
    toast.add({
      id: "error",
      title: msg,
      description: "Please try again.",
      color: "red",
      icon: "i-heroicons-x-circle",
      timeout: props.timeout,
      ui: props.ui,
      callback: removeError,
    });
  }
};
