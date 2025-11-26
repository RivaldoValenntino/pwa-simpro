/* eslint-disable @typescript-eslint/no-explicit-any */
export function encrypt(obj: any) {
  return btoa(JSON.stringify(obj));
}

export function decrypt(str: string ) {
  try {
    return JSON.parse(atob(str));
  } catch {
    return {};
  }
}