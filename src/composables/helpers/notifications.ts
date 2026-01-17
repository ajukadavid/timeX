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
  const timeout = 2000;

  if (msg === "success" || code === 200) {
    toast.add({
      id: "success",
      title: msg,
      type: "success",
      timeout: timeout,
    });
  } else if (msg === "error" || code !== 200) {
    toast.add({
      id: "error",
      title: msg,
      description: "Registration failed!",
      type: "error",
      timeout: timeout,
    });
  }
};

export const userToast = (errArr: any[], code?: number) => {
  const msg = concatenateValues(errArr);
  const toast = useToast();
  const timeout = 2000;

  if (msg === "success" || code === 200) {
    toast.add({
      id: "success",
      title: msg,
      type: "success",
      timeout: timeout,
    });
  } else if (msg === "error" || code !== 200) {
    toast.add({
      id: "error",
      title: msg,
      description: "Please try again.",
      type: "error",
      timeout: timeout,
    });
  }
};
