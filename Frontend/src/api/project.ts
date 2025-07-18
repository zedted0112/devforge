import projectClient from './projectClient';
import type { Project, ProjectsResponse } from '../types/project';

export interface CreateProjectPayload {
  title: string;
  description?: string;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
}

// Get all projects for the authenticated user
export const getProjects = async (): Promise<ProjectsResponse> => {
  const response = await projectClient.get<ProjectsResponse>('/projects');
  return response.data;
};

// Get a single project by ID
export const getProject = async (id: string): Promise<{ project: Project }> => {
  const response = await projectClient.get<{ project: Project }>(`/projects/${id}`);
  return response.data;
};

// Create a new project
export const createProject = async (payload: CreateProjectPayload): Promise<{ message: string; project: Project }> => {
  const response = await projectClient.post<{ message: string; project: Project }>('/projects', payload);
  return response.data;
};

// Update an existing project
export const updateProject = async (id: string, payload: UpdateProjectPayload): Promise<{ message: string; project: Project }> => {
  const response = await projectClient.put<{ message: string; project: Project }>(`/projects/${id}`, payload);
  return response.data;
};

// Delete a project
export const deleteProject = async (id: string): Promise<{ message: string }> => {
  const response = await projectClient.delete<{ message: string }>(`/projects/${id}`);
  return response.data;
}; 