/**
 * Connection-test service: fetches hello message from API.
 * Not part of spec-driven features; for validation only.
 */

export interface HelloResponse {
  message: string;
}

export const getHelloFromApi = (): Promise<HelloResponse> =>
  fetch('/api').then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });
