// src/types.ts

export interface TerminologyItem {
  GroupingsID: number;
  Terminology: string;
  Acronym: string | null;
  Description: string;
}

export interface TerminologyListProps {
  data: TerminologyItem[];
  handleDelete: (id: number) => void;
  showActions: boolean;
}

export interface AdminNavbarProps {
  searchTerm: string;
  setSearchTerm: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
  username: string;
}

export interface Contributor {
  id: number;
  name: string;
  role: string;
  contribution: string;
  profile_image_url: string | null;
}