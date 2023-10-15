export interface Login {
  email: string;
  password?: string;
}

export interface EmployerRegister extends Login {
  firstName: string;
  lastName: string;
  companyName: string;
  phone?: string;
}

export interface StaffRegister {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
