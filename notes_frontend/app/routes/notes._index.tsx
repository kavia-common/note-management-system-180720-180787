import { NavLink } from "@remix-run/react";

export default function NotesIndexSplash() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">No note selected</h2>
        <p className="mt-1 text-sm text-gray-600">Choose a note from the sidebar or create a new one.</p>
        <NavLink
          to="/notes/new"
          className="mt-4 inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          New note
        </NavLink>
      </div>
    </div>
  );
}
