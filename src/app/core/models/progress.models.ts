// Mirrors app/schemas/progress.py in prep-app-be.

export interface ProgressUpdateRequest {
  topic: string;
  subtopic: string;
  checked: boolean;
}

export interface ProgressResponse {
  // subtopic name -> checked. Absent keys mean "not yet marked" (false).
  progress: Record<string, boolean>;
}
