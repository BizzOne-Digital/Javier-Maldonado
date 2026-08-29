export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function adminFetch<T>(
  url: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: isFormData
      ? init?.headers
      : { "Content-Type": "application/json", ...init?.headers },
  });

  if (res.headers.get("content-type")?.includes("text/csv")) {
    return { success: true, data: res as unknown as T };
  }

  return res.json();
}

export {
  deleteStoredUpload,
  uploadFile,
  uploadImageToStorage,
} from "@/lib/admin-upload";
