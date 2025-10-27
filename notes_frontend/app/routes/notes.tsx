import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "Notes • Ocean Notes" },
];

export default function NotesRoute() {
  return (
    // Container for nested routes (/notes, /notes/:id, /notes/new)
    <div className="h-full">
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm text-red-700">
      Something went wrong in Notes route.
    </div>
  );
}
