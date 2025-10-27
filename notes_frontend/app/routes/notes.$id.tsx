import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { deleteNote, getNote, updateNote } from "~/models/note.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.note?.title ? `${data.note.title} • Ocean Notes` : "Note • Ocean Notes";
  return [{ title }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;
  const note = await getNote(id);
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = params.id!;
  const formData = await request.formData();
  const intent = formData.get("_intent");

  if (intent === "delete") {
    await deleteNote(id);
    return redirect("/");
  }

  const title = (formData.get("title") as string) || "Untitled";
  const content = (formData.get("content") as string) || "";
  const updated = await updateNote(id, { title, content });
  if (!updated) {
    return json({ error: "Unable to update note" }, { status: 400 });
  }
  return json({ ok: true });
}

export default function NoteDetail() {
  const { note } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const params = useParams();

  const isSaving = navigation.state === "submitting" && (navigation.formData?.get("_intent") ?? "") !== "delete";
  const isDeleting = navigation.state === "submitting" && navigation.formData?.get("_intent") === "delete";

  // Auto-save on change after blur or cmd+s; for simplicity, a Save button is provided
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Edit Note</h2>
        <Form method="post" replace>
          <input type="hidden" name="_intent" value="delete" />
          <button
            type="submit"
            className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete note"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </Form>
      </div>

      <Form method="post" className="flex flex-col gap-3" replace>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={note.title}
            className="mt-1 w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            defaultValue={note.content}
            rows={12}
            className="mt-1 w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Save note"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          {actionData && "error" in actionData ? (
            <p className="text-sm text-red-600">{actionData.error}</p>
          ) : null}
        </div>
      </Form>

      <div className="mt-2 text-xs text-gray-400">
        Note ID: {params.id} • Last updated {new Date(note.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm text-red-700">
      Something went wrong loading this note.
    </div>
  );
}

export function CatchBoundary() {
  return (
    <div className="rounded-md border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
      Note not found.
    </div>
  );
}
