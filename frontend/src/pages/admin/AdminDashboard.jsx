import { Link } from "react-router-dom";

const cards = [
  { title: "User Management", description: "Manage buyers, sellers, and admins.", link: "/admin/users" },
  { title: "Auction Approval", description: "Approve or review auction listings.", link: "/admin/approvals" },
  { title: "Reports", description: "View analytics and platform insights.", link: "/admin/reports" },
  { title: "Disputes", description: "Handle disputes and support tickets.", link: "/admin/disputes" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-amber-600">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor platform activity and manage essential admin tools.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
              <p className="mt-2 text-gray-500">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
