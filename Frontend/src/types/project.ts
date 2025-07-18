export interface Project {
    id: string;
    title: string;
    description?: string;
    ownerId: number;
    createdAt: string;
  }
  
  export interface ProjectsResponse {
    projects: Project[];
  }