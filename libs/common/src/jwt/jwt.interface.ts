enum UserRoleEnum {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export interface JwtPayload {
  userId: string;
  role: UserRoleEnum;
  exp: number;
}
