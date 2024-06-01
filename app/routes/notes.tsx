import {
  Link,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useCatc,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";

import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/note";

export default function NotesPage() {
  const notes = useLoaderData(); // used for fetching data
  const action = useActionData(); // used for getting post result

  return (
    <main>
      <p>{action?.message || ""}</p>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export function links() {
  return [...newNoteLinks(), ...noteLinks()];
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: "couldnot find notes" },
      { status: 404, statusText: "notes not found!" }
    );
  }
  return notes;
}

export async function action(data) {
  const formData = (await data.request.formData()) as FormData;
  // const newData = {
  //   title: formData.get("title"),
  //   content: formData.get("content"),
  // };
  const noteData = Object.fromEntries(formData);
  if (noteData.title.trim().length < 5) {
    return {
      status: 400,
      message: "Invalid title- must be at least 5 chars long!",
    };
  }
  noteData.id = new Date().toISOString();
  const existingNotes = await getStoredNotes();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect("/notes");
}

// export function CatchBoundary() {
//   const caughtResponse = useCatch();
//   const message = caughtResponse?.data?.message || "data not found";
//   return (
//     <main>
//       <p>{message}</p>
//     </main>
//   );
// }

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    // catchboundary: server known error ie. 400, 40x...
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export function meta() {
  return {
    title: "All notes",
    description: "Manage your notes",
  };
}
