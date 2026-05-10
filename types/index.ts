// ─── Generic API Response Wrappers ───────────────────────────────────────────

export interface ApiSuccessResponse {
  success: true;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type * from "./auth";
export type * from "./report";
export type * from "./map";
export type * from "./match";
export type * from "./notification";
export type * from "./stats";
