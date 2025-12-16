export type ID = string;

export type About = {
  id: ID;
  title: string;
  content: string;
};

export type Skill = {
  id: ID;
  name: string;
  level?: string;
};

export type Project = {
  id: ID;
  title: string;
  description?: string;
  url?: string;
};

export type Experience = {
  id: ID;
  company: string;
  role: string;
  from?: string;
  to?: string;
};

export type Contact = {
  id: ID;
  label: string;
  value: string;
};

export type Resource = About | Skill | Project | Experience | Contact;

const STORAGE_PREFIX = "portfolio_cms";

function key(resourceName: string) {
  return `${STORAGE_PREFIX}:${resourceName}`;
}

function read<T extends Resource>(resourceName: string): T[] {
  const raw = localStorage.getItem(key(resourceName));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function write<T extends Resource>(resourceName: string, items: T[]) {
  localStorage.setItem(key(resourceName), JSON.stringify(items));
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export const cmsService = {
  list<T extends Resource>(resourceName: string): Promise<T[]> {
    return Promise.resolve(read<T>(resourceName));
  },
  get<T extends Resource>(
    resourceName: string,
    id: ID
  ): Promise<T | undefined> {
    const arr = read<T>(resourceName);
    return Promise.resolve(arr.find((x) => x.id === id));
  },
  create<T extends Resource>(
    resourceName: string,
    item: Omit<T, "id">
  ): Promise<T> {
    const arr = read<T>(resourceName);
    const newItem = { ...(item as object), id: generateId() } as T;
    arr.unshift(newItem);
    write(resourceName, arr);
    return Promise.resolve(newItem);
  },
  update<T extends Resource>(
    resourceName: string,
    id: ID,
    patch: Partial<T>
  ): Promise<T | undefined> {
    const arr = read<T>(resourceName);
    const idx = arr.findIndex((x) => x.id === id);
    if (idx === -1) return Promise.resolve(undefined);
    arr[idx] = { ...(arr[idx] as object), ...(patch as object) } as T;
    write(resourceName, arr);
    return Promise.resolve(arr[idx]);
  },
  remove(resourceName: string, id: ID): Promise<boolean> {
    const arr = read(resourceName);
    const idx = arr.findIndex((x) => x.id === id);
    if (idx === -1) return Promise.resolve(false);
    arr.splice(idx, 1);
    write(resourceName, arr);
    return Promise.resolve(true);
  },
};
