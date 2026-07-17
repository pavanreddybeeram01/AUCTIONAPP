import { useEffect, useState } from "react";
import API from "../../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/auth/users");
        setUsers(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-md">
      <h2 className="mb-6 text-3xl font-bold">User Management</h2>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Verified</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3">{user.fullName}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.role}</td>
                  <td className="py-3">{user.verified ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
