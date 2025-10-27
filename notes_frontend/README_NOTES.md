Ocean Notes - Developer Notes

- Temporary data layer: app/models/note.server.ts keeps an in-memory list with seed notes.
- TODO: Replace with real database (e.g., connect to notes_database container or Supabase):
  * Swap listNotes/getNote/createNote/updateNote/deleteNote to call your backend/API.
  * Ensure environment variables are read from .env (do not hardcode).
- Routes:
  * /         -> Welcome state
  * /notes    -> Parent route for notes
  * /notes    -> With index child (app/routes/notes._index.tsx) empty state
  * /notes/new -> Create note
  * /notes/:id -> View/edit selected note
- Styling: Ocean Professional theme with Tailwind CSS; see app/tailwind.css for theme tokens.
- Accessibility: Forms use proper labels, buttons have aria-labels, focus rings enabled.
- Optimistic UI: Basic feedback via "Saving.../Deleting..." states during submissions.
