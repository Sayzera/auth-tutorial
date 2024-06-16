
import { useCurrentUser } from "./session";

export const useCurrentRole = () => {
    const session = useCurrentUser();
    return session?.role;

}