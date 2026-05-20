import React, { createContext, ReactNode, useState } from "react";

interface Usuario {
  id?: string | number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  fotoPerfil?: string;
}

interface UserContextType {
  usuario: Usuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
}

export const UserContext = createContext<UserContextType>({
  usuario: null,
  setUsuario: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
}