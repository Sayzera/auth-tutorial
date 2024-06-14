import { useEffect, useState } from "react";

type UserData = {
    email?: string;
    id?: string;
    image?: string | null; 
    name?: string;
    role?: string;
}

export const useCurrentUser = () => {
  const [session, setSession] = useState<UserData>({});
  console.log(session);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data.user);
      });
  }, []);

  return session
};
