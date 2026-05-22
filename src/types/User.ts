export type LoginRequest = {
  mail: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  userId: number;
  mail: string;
  prenom: string;
  nom: string;
  role: string;
};

export type User = {
  userId: number;
  mail: string;
  prenom: string;
  nom: string;
  role: string;
};