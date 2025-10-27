import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export default function RootErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="rounded-md border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
        {error.status} {error.statusText}
      </div>
    );
  }
  return (
    <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm text-red-700">
      An unexpected error occurred.
    </div>
  );
}
