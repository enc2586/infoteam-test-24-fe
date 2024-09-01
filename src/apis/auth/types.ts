export type LoginInputs = {
  email: string;
  password: string;
};

export type UserType = {
  id: string;
  nickname: string;
  createdAt: Date;
};

export type RawUserType = Omit<UserType, "createdAt"> & {
  createdAt: string;
};
