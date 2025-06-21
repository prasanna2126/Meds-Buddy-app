export enum UserRole {
  PATIENT = 'patient',
  CARETAKER = 'caretaker'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
