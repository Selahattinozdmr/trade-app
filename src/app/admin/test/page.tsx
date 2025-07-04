import React from "react";

export default function AdminTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Admin Access Working!
        </h1>
        <p className="text-gray-600 mb-6">
          If you can see this page, your admin authentication is working
          correctly.
        </p>
        <a
          href="/admin/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
