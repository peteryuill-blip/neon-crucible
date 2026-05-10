export interface Work {
  id: number;
  slug: string;
  title: string;
  tCode: string;
  sovereignId: string;
  phaseId: number;
  medium: string | null;
  dimensions: string | null;
  rating: number | null;
  disposition: string;
  technicalObservation: string | null;
  weekNumber: number | null;
  createdAt: string | null;
}

export interface User {
  id: number;
  openId: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: "admin" | "editor" | "viewer";
  createdAt: string | null;
  lastLoginAt: string | null;
}

export interface OracleTelemetry {
  ambient_context?: {
    steps?: number;
    heart_rate?: number;
    energy?: number;
  };
  matrix_flags?: {
    is_kill?: boolean;
    is_save?: boolean;
  };
  week_number?: number;
}
