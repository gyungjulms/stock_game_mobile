export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let detail: any = undefined;
    try { detail = await res.json(); } catch {}
    const msg = detail?.error?.message || res.statusText;
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export const api = {
  health: () => request<{ status: string; time: string }>(`/health`),
  createGame: (payload: any) => request(`/games`, { method: 'POST', body: JSON.stringify(payload) }),
  getGame: (gameId: string) => request(`/games/${gameId}`),
  listAssets: (gameId: string) => request(`/games/${gameId}/assets`),
  addParticipant: (gameId: string, name: string) => request(`/games/${gameId}/participants`, { method: 'POST', body: JSON.stringify({ name }) }),
  listParticipants: (gameId: string) => request(`/games/${gameId}/participants`),
  allocate: (gameId: string, participantId: string, allocations: any[]) => request(`/games/${gameId}/portfolio/${participantId}/allocate`, { method: 'POST', body: JSON.stringify({ allocations }) }),
  getPortfolio: (gameId: string, participantId: string) => request(`/games/${gameId}/portfolio/${participantId}`),
  advanceTurn: (gameId: string, returns: any[], note?: string) => request(`/games/${gameId}/turns/advance`, { method: 'POST', body: JSON.stringify({ returns, note }) }),
  getTurn: (gameId: string, turn: number) => request(`/games/${gameId}/turns/${turn}`),
  leaderboard: (gameId: string) => request(`/games/${gameId}/leaderboard`),
  simulate: (gameId: string, returnsByTurn?: any[][]) => request(`/games/${gameId}/simulate`, { method: 'POST', body: JSON.stringify({ returnsByTurn }) }),
  reset: (gameId: string, keepParticipants = false) => request(`/games/${gameId}/reset`, { method: 'POST', body: JSON.stringify({ keepParticipants }) })
};


