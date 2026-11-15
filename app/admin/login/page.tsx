import PortalLogin from "@/app/components/PortalLogin";

export default function AdminLoginPage() {
  return (
    <PortalLogin
      title="Admin"
      subtitle="Store dashboard"
      allowed={["admin"]}
      redirectTo="/admin/orders"
      background="/images/tiramisu.jpg"
      sidePanel={
        <>
          <p className="text-2xl font-medium tracking-[0.05em] drop-shadow">LÄYRD Admin</p>
          <p className="mt-3 text-sm drop-shadow">See new orders as they come in and update their status.</p>
        </>
      }
    />
  );
}
