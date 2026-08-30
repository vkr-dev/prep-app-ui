// Mirrors app/schemas/search_history.py in prep-app-be.

export interface SearchHistoryItem {
  topic: string;
  short_label: string;
  category: string;
  last_searched_at: string;
}

export interface SearchHistoryGroup {
  category: string;
  items: SearchHistoryItem[];
}

export interface SearchHistoryResponse {
  groups: SearchHistoryGroup[];
}
