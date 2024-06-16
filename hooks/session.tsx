import { useEffect, useState } from "react";

type UserData = {
    email?: string;
    id?: string;
    image?: string | null; 
    name?: string;
    role?: string;
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
}

export const useCurrentUser = () => {
  const [session, setSession] = useState<UserData>({});

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data.user);
      });
  }, []);

  return session
};
