import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { createNote } from "~/models/note.server";

export const meta: MetaFunction = () => [
  { title: "New Note • Ocean Notes" },
];

export async function loader() {
  return json({ defaultTitle: "", defaultContent: "" });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = (formData.get("title") as string) || "Untitled";
  const content = (formData.get("content") as string) || "";
  const note = await createNote({ title, content });
  return redirect(`/notes/${note.id}`);
}

export default function NewNote() {
  const nav = useNavigation();
  const isSubmitting = nav.state === "submitting";
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Create Note</h2>
      <Form method="post" className="flex flex-col gap-3" replace>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            placeholder="Note title"
            className="mt-1 w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            placeholder="Start typing..."
            className="mt-1 w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </Form>
    </div>
  );
}
