import fs from "fs/promises";

export async function getStoredNotes() {
  const rawFileContent = await fs.readFile("public/notes.json", {
    encoding: "utf-8",
  });
  const data = JSON.parse(rawFileContent);
  const storedNotes = data.notes ?? [];

  return storedNotes;
}

export function storeNotes(notes: any) {
  return fs.writeFile(
    "public/notes.json",
    JSON.stringify({ notes: notes || [] })
  );
}
