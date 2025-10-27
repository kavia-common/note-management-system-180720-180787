import { randomUUID } from "node:crypto";

/**
 * In-memory notes data store for development.
 * TODO: Replace with real database integration (e.g., Supabase/Postgres) via a backend API.
 */

export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number; // timestamp
  createdAt: number; // timestamp
};

let seeded = false;
let NOTES: Note[] = [];

// Seed demo notes on first load to showcase UI
function seedNotes() {
  if (seeded) return;
  const now = Date.now();
  NOTES = [
    {
      id: randomUUID(),
      title: "Welcome to Ocean Notes",
      content:
        "This is a demo note. Use the sidebar to navigate, the header to search, and the editor to update content.",
      createdAt: now - 1000 * 60 * 60 * 24,
      updatedAt: now - 1000 * 60 * 30,
    },
    {
      id: randomUUID(),
      title: "Remix + Tailwind",
      content:
        "This app uses Remix with Tailwind CSS. Loaders provide data and actions handle mutations.",
      createdAt: now - 1000 * 60 * 60 * 12,
      updatedAt: now - 1000 * 60 * 10,
    },
    {
      id: randomUUID(),
      title: "Next Steps",
      content:
        "- Connect to your database\n- Add auth\n- Enhance search\n- Add tags and pinning",
      createdAt: now - 1000 * 60 * 60 * 2,
      updatedAt: now - 1000 * 60 * 5,
    },
  ];
  seeded = true;
}

/**
PUBLIC_INTERFACE
*/
export async function listNotes(query?: string): Promise<Note[]> {
  /** Returns all notes optionally filtered by a simple title/content substring query. */
  seedNotes();
  let items = [...NOTES];
  if (query && query.trim()) {
    const q = query.toLowerCase();
    items = items.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }
  // newest first
  items.sort((a, b) => b.updatedAt - a.updatedAt);
  return items;
}

/**
PUBLIC_INTERFACE
*/
export async function getNote(id: string): Promise<Note | null> {
  /** Fetch a single note by id or null if not found. */
  seedNotes();
  return NOTES.find((n) => n.id === id) ?? null;
}

/**
PUBLIC_INTERFACE
*/
export async function createNote(input: {
  title: string;
  content: string;
}): Promise<Note> {
  /** Create a new note with title/content. */
  seedNotes();
  const now = Date.now();
  const note: Note = {
    id: randomUUID(),
    title: input.title || "Untitled",
    content: input.content || "",
    createdAt: now,
    updatedAt: now,
  };
  NOTES.unshift(note);
  return note;
}

/**
PUBLIC_INTERFACE
*/
export async function updateNote(
  id: string,
  input: { title: string; content: string }
): Promise<Note | null> {
  /** Update existing note title/content; returns updated note or null. */
  seedNotes();
  const idx = NOTES.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  const next: Note = {
    ...NOTES[idx],
    title: input.title,
    content: input.content,
    updatedAt: Date.now(),
  };
  NOTES[idx] = next;
  return next;
}

/**
PUBLIC_INTERFACE
*/
export async function deleteNote(id: string): Promise<boolean> {
  /** Delete a note by id; returns true if deleted. */
  seedNotes();
  const before = NOTES.length;
  NOTES = NOTES.filter((n) => n.id !== id);
  return NOTES.length < before;
}
