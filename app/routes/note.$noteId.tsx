import { Link, json, useLoaderData } from "@remix-run/react";
import { getStoredNotes } from "~/data/note";

import Styles from "~/styles/note-details.css?url";

export default function NoteDetailsPage() {
  const note = useLoaderData();
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to={"/notes"}>Back to notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: Styles }];
}

export async function loader({ params }) {
  const notes = await getStoredNotes();
  const selectedNotes = notes.find((note) => note.id === params.notedId);
  if (!selectedNotes) {
    throw json(
      { message: "could not find not for id " + params.noteId },
      { status: 404, statusText: "not found" }
    );
  }
  return selectedNotes;
}
