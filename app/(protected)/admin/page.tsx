
import { currentRole } from "@/lib/auth";
import AdminComponent from "./_components/admin-component";

const AdminPage = async () => {
  const role = await currentRole();


  return (
    <AdminComponent role={role as string}  />
  )
}

export default AdminPage