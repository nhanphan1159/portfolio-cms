/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiListResponse<T> = T[] | { data: T[] } | { items: T[] };

export type ApiSingleResponse<T> =
  | T
  | { data: T }
  | { item: T }
  | T[]
  | { data: T[] }
  | { items: T[] };

export function toList<T>(res: unknown): T[] {
  const r = res as ApiListResponse<T> | undefined;
  if (!r) return [];
  if (Array.isArray(r)) return r;
  const anyR = r as any;
  if (Array.isArray(anyR.data)) return anyR.data as T[];
  if (Array.isArray(anyR.items)) return anyR.items as T[];
  return [];
}

export function toSingle<T extends { id?: string; _id?: string }>(
  res: unknown
): (T & { id?: string }) | null {
  const r = res as ApiSingleResponse<T> | undefined;
  if (!r) return null;
  let item: T | undefined;
  if (Array.isArray(r)) {
    item = (r as T[])[0];
  } else {
    const anyR = r as any;
    if (anyR && typeof anyR === "object") {
      if (anyR.data) item = anyR.data as T;
      else if (anyR.item) item = anyR.item as T;
      else item = anyR as T;
      if (!item && Array.isArray(anyR.data)) item = anyR.data[0] as T;
      if (!item && Array.isArray(anyR.items)) item = anyR.items[0] as T;
    }
  }
  if (!item) return null;
  const id = (item as any).id ?? (item as any)._id;
  return { ...(item as any), id } as T & { id?: string };
}
