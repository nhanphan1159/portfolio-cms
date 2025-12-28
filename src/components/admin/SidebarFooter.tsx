import { useAuth } from "../../contexts/AuthContext";

export function SidebarFooter() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      await signOut();
    }
  };

  return (
    <div className="p-4 border-t space-y-3">
      {user && (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
      >
        Đăng xuất
      </button>

      <div className="text-xs text-gray-500 text-center">
        © 2025 Portfolio CMS
      </div>
    </div>
  );
}
