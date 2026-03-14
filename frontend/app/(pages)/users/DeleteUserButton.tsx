"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetchClient } from "@/lib/api/authFetchClient";

export default function DeleteUserButton({ userId, isCurrentUser }: { userId: string, isCurrentUser: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (isCurrentUser) {
      alert("You cannot delete your own account.");
      return;
    }
    
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await authFetchClient(`/api/users/${userId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.detail || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || isCurrentUser}
      className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
        isCurrentUser 
          ? "bg-gray-50 text-gray-300 cursor-not-allowed"
          : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
      } ${isDeleting ? "opacity-50 cursor-not-allowed border-none" : "hover:shadow-md"}`}
      title={isCurrentUser ? "Cannot delete your own account" : "Delete User"}
    >
      {isDeleting ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
