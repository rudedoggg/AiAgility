import { apiRequest, getAuthHeaders } from "./queryClient";
import { API_BASE_URL } from "./config";

export type ApiProject = {
  id: string;
  name: string;
  summary: string;
  executiveSummary: string;
  dashboardStatus: {
    status: string;
    done: string[];
    undone: string[];
    nextSteps: string[];
  };
  createdAt: string;
};

export type ApiGoalSection = {
  id: string;
  projectId: string;
  genericName: string;
  subtitle: string;
  completeness: number;
  totalItems: number;
  completedItems: number;
  content: string;
  sortOrder: number;
};

export type ApiLabBucket = {
  id: string;
  projectId: string;
  name: string;
  sortOrder: number;
};

export type ApiDeliverable = {
  id: string;
  projectId: string;
  title: string;
  subtitle: string;
  completeness: number;
  status: string;
  content: string;
  engaged: boolean;
  sortOrder: number;
};

export type ApiBucketItem = {
  id: string;
  parentId: string;
  parentType: string;
  type: string;
  title: string;
  preview: string;
  date: string;
  url: string | null;
  fileName: string | null;
  fileSizeLabel: string | null;
  sortOrder: number;
};

export type ApiChatMessage = {
  id: string;
  parentId: string;
  parentType: string;
  role: string;
  content: string;
  timestamp: string;
  hasSaveableContent: boolean;
  saved: boolean;
  sortOrder: number;
};

async function json<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}

export async function fetchJson<T>(url: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}${url}`, { headers });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  projects: {
    list: () => fetchJson<ApiProject[]>("/api/projects"),
    get: (id: string) => fetchJson<ApiProject>(`/api/projects/${id}`),
    create: (data: Partial<ApiProject>) => apiRequest("POST", "/api/projects", data).then(json<ApiProject>),
    update: (id: string, data: Partial<ApiProject>) => apiRequest("PATCH", `/api/projects/${id}`, data).then(json<ApiProject>),
    delete: (id: string) => apiRequest("DELETE", `/api/projects/${id}`),
  },

  goals: {
    list: (projectId: string) => fetchJson<ApiGoalSection[]>(`/api/projects/${projectId}/goals`),
    create: (projectId: string, data: Partial<ApiGoalSection>) => apiRequest("POST", `/api/projects/${projectId}/goals`, data).then(json<ApiGoalSection>),
    update: (id: string, data: Partial<ApiGoalSection>) => apiRequest("PATCH", `/api/goals/${id}`, data).then(json<ApiGoalSection>),
    delete: (id: string) => apiRequest("DELETE", `/api/goals/${id}`),
    reorder: (projectId: string, ids: string[]) => apiRequest("PUT", `/api/projects/${projectId}/goals/reorder`, { ids }),
  },

  lab: {
    list: (projectId: string) => fetchJson<ApiLabBucket[]>(`/api/projects/${projectId}/lab`),
    create: (projectId: string, data: Partial<ApiLabBucket>) => apiRequest("POST", `/api/projects/${projectId}/lab`, data).then(json<ApiLabBucket>),
    update: (id: string, data: Partial<ApiLabBucket>) => apiRequest("PATCH", `/api/lab/${id}`, data).then(json<ApiLabBucket>),
    delete: (id: string) => apiRequest("DELETE", `/api/lab/${id}`),
    reorder: (projectId: string, ids: string[]) => apiRequest("PUT", `/api/projects/${projectId}/lab/reorder`, { ids }),
  },

  deliverables: {
    list: (projectId: string) => fetchJson<ApiDeliverable[]>(`/api/projects/${projectId}/deliverables`),
    create: (projectId: string, data: Partial<ApiDeliverable>) => apiRequest("POST", `/api/projects/${projectId}/deliverables`, data).then(json<ApiDeliverable>),
    update: (id: string, data: Partial<ApiDeliverable>) => apiRequest("PATCH", `/api/deliverables/${id}`, data).then(json<ApiDeliverable>),
    delete: (id: string) => apiRequest("DELETE", `/api/deliverables/${id}`),
    reorder: (projectId: string, ids: string[]) => apiRequest("PUT", `/api/projects/${projectId}/deliverables/reorder`, { ids }),
  },

  items: {
    list: (parentType: string, parentId: string) => fetchJson<ApiBucketItem[]>(`/api/items/${parentType}/${parentId}`),
    create: (data: Partial<ApiBucketItem>) => apiRequest("POST", "/api/items", data).then(json<ApiBucketItem>),
    delete: (id: string) => apiRequest("DELETE", `/api/items/${id}`),
  },

  messages: {
    list: (parentType: string, parentId: string) => fetchJson<ApiChatMessage[]>(`/api/messages/${parentType}/${parentId}`),
    create: (data: Partial<ApiChatMessage>) => apiRequest("POST", "/api/messages", data).then(json<ApiChatMessage>),
    update: (id: string, data: Partial<ApiChatMessage>) => apiRequest("PATCH", `/api/messages/${id}`, data).then(json<ApiChatMessage>),
  },

  coreQueries: {
    list: () => fetchJson<ApiCoreQuery[]>("/api/core-queries"),
    listAdmin: () => fetchJson<ApiCoreQuery[]>("/api/admin/core-queries"),
    update: (locationKey: string, contextQuery: string) => apiRequest("PUT", `/api/admin/core-queries/${locationKey}`, { contextQuery }).then(json<ApiCoreQuery>),
  },
};

export type ApiCoreQuery = {
  id: string;
  locationKey: string;
  contextQuery: string;
  updatedAt: string;
};
