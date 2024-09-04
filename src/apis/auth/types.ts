export type LoginInputs = {
  email: string;
  password: string;
};

export type UserType = {
  id: string;
  email: string;
  nickname: string;
  createdAt: Date;
};

export type RawUserType = Omit<UserType, "createdAt"> & {
  createdAt: string;
};

export type DecodedAccessTokenType = {
  AUTH: string;
  exp: number;
  sub: string;
};
