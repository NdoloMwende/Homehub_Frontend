import api from "./api";

export const loginUser = async (email: string, password: string) => {
  const res = await api.get(`/users?email=${email}&password_hash=${password}`);
  if (res.data.length === 0) {
    throw new Error("Invalid email or password");
  }
  return res.data[0]; // return the first matching user
};