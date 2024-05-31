import { redirect } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import { getStoredNotes, storeNotes } from "~/data/note";

export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  );
}

export function links() {
  return [...newNoteLinks()];
}

export async function action(data) {
  const formData = (await data.request.formData()) as FormData;
  // const newData = {
  //   title: formData.get("title"),
  //   content: formData.get("content"),
  // };
  const noteData = Object.fromEntries(formData);
  noteData.id = new Date().toISOString();
  const existingNotes = await getStoredNotes();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect("/notes");
}
