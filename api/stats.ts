import api from "@/lib/axios";

export async function fetchStats() {
  const { data } = await api.get("/stats");
  return data.data; // unwrap envelope
}
