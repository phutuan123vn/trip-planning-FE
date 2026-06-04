const TOKEN_KEY = "access_token";
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export function setTokenCookie(token: string): void {
  const expires = new Date(Date.now() + TOKEN_TTL_MS).toUTCString();
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getTokenCookie(): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_KEY}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function removeTokenCookie(): void {
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}
