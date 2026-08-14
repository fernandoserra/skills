const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const Endpoints = {
  login: `${API_URL}auth/login`,
  register: `${API_URL}auth/register`,
  // Agregar acá el resto de endpoints del backend a medida que se necesiten.
};
