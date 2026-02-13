type Project = {
  id: string;
  name: string;
};

type ProjectListener = (project: Project) => void;

const STORAGE_KEY = "agilityai:selectedProject";

const listeners = new Set<ProjectListener>();

const defaultProject: Project = {
  id: "p-1",
  name: "Office Location Decision",
};

function safeParse(json: string | null) {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getSelectedProject(): Project {
  const parsed = safeParse(typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null);
  if (parsed && typeof parsed.id === "string" && typeof parsed.name === "string") return parsed;
  return defaultProject;
}

export function setSelectedProject(project: Project) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch {
    // ignore
  }

  listeners.forEach((l) => l(project));
}

export function subscribeToSelectedProject(listener: ProjectListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
