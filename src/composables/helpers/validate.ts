import type { FormError } from "@nuxt/ui/dist/runtime/types";
import { userLoginToast, userRegistrationToast } from "./notifications";

function containsSpecialCharacter(str: string): boolean {
  const specialCharacters = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|-]/;
  return specialCharacters.test(str);
}

function containsUppercaseAndNumber(str: string): boolean {
  const hasUppercase = /[A-Z]/.test(str);
  const hasNumber = /\d/.test(str);
  return hasUppercase && hasNumber;
}

export const useLoginValidate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email)
    errors.push({ path: "email", message: "Email is Required" });
  if (state.password.length < 8)
    errors.push({
      path: "password",
      message: "Password must be at least 8 characters",
    });
  if (errors.length > 0) userLoginToast(errors);
  return errors;
};

export const useSignUpValidate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.firstName)
    errors.push({ path: "given_name", message: "First Name is Required" });
  if (!state.lastName)
    errors.push({ path: "family_name", message: "Last Name is Required" });
  if (!state.companyName)
    errors.push({ path: "company_name", message: "Company Name is Required" });
  if (state.password.length < 8)
    errors.push({
      path: "password",
      message: "Password must be at least 8 characters",
    });
  if (!containsSpecialCharacter(state.password)) {
    errors.push({
      path: "password",
      message: "Password must contain at least one special character",
    });
  }
  if (!containsUppercaseAndNumber(state.password)) {
    errors.push({
      path: "password",
      message:
        "Password must contain at least one uppercase letter and one number",
    });
  }
  if (errors.length > 0) userRegistrationToast(errors);
  return errors;
};
