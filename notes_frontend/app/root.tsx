import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Form,
  NavLink,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import "./tailwind.css";
import { listNotes, type Note } from "./models/note.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Ocean Notes" },
    { name: "description", content: "Create, search, and manage your notes." },
  ];
};

// Root loader to provide initial list for sidebar and search term
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const notes = await listNotes(q);
  return json({ notes, q });
}

type RootLoaderData = { notes: Note[]; q: string };

function Header() {
  const navigation = useNavigation();
  const isSearching = navigation.formAction == null && navigation.formMethod === "GET";
  const data = useRouteLoaderData<typeof loader>() as RootLoaderData | undefined;

  return (
    <header className="sticky top-0 z-30 border-b border-blue-100 bg-gradient-to-r from-blue-500/10 to-gray-50 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <NavLink to="/" className="flex items-center gap-2 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="h-6 w-6 rounded bg-blue-600" aria-hidden />
          <span className="text-lg font-semibold text-gray-900">Ocean Notes</span>
        </NavLink>

        <Form
          id="search-form"
          role="search"
          method="get"
          replace
          className="ml-auto flex flex-1 max-w-xl items-center gap-2"
        >
          <label htmlFor="q" className="sr-only">
            Search notes
          </label>
          <input
            id="q"
            name="q"
            defaultValue={data?.q ?? ""}
            placeholder="Search notes..."
            className="w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
            aria-label="Search notes"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </Form>
      </div>
    </header>
  );
}

function Sidebar({ notes }: { notes: RootLoaderData["notes"] }) {
  return (
    <aside className="h-full w-full max-w-xs border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between px-3 py-3">
        <h2 className="text-sm font-semibold text-gray-700">Notes</h2>
        <NavLink
          to="/notes/new"
          prefetch="intent"
          className="rounded-md bg-amber-500 px-2 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          New
        </NavLink>
      </div>
      <nav aria-label="Notes list" className="overflow-auto px-2 pb-4">
        {notes.length === 0 ? (
          <p className="px-2 py-6 text-sm text-gray-500">No notes found. Create one!</p>
        ) : (
          <ul className="space-y-1">
            {notes.map((n) => (
              <li key={n.id}>
                <NavLink
                  to={`/notes/${n.id}`}
                  prefetch="intent"
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="line-clamp-1">{n.title || "Untitled"}</span>
                  <span className="mt-0.5 block text-xs text-gray-400">
                    {new Date(n.updatedAt).toLocaleString()}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-[#f9fafb] text-[#111827]">
        <Header />
        <main className="mx-auto flex h-[calc(100vh-56px)] max-w-7xl gap-4 p-4">
          <RootShell>{children}</RootShell>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function RootShell({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData("root") as RootLoaderData | undefined;

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-100">
        <Sidebar notes={data?.notes ?? []} />
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return <Outlet />;
}

export { default as ErrorBoundary } from "./error-boundary";
