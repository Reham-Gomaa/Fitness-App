export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
  photo: string;
  createdAt: string;
}

export interface UserResponse {
  message: string;
  user: User;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  goal?: string;
  gender?: string;
}

export interface GoalOption {
  value: string;
  label: string;
}

export interface ActivityLevelOption {
  value: string;
  label: string;
}

export interface ChangePasswordResponse {
  message: string;
  token: string;
}

export interface LogoutResponse {
  message: string;
}
