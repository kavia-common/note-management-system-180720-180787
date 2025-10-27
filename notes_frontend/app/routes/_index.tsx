import { NavLink } from "@remix-run/react";

export default function Index() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome to Ocean Notes</h1>
        <p className="mt-2 text-sm text-gray-600">
          Select a note from the sidebar or create a new one to get started.
        </p>
        <NavLink
          to="/notes/new"
          className="mt-6 inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          Create a new note
        </NavLink>
      </div>
    </div>
  );
}
