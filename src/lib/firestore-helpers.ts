import "server-only";
import type { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";

// Turn a Firestore doc snapshot into the same { id, ...data } shape the UI uses.
export function fromSnap<T>(snap: QueryDocumentSnapshot | DocumentSnapshot): T {
  return { id: snap.id, ...(snap.data() as object) } as T;
}

// Remove client-supplied id before writing — Firestore stores id as the doc id.
export function stripId<T extends { id?: string }>(obj: T): Omit<T, "id"> {
  const { id: _ignored, ...rest } = obj;
  void _ignored;
  return rest;
}
