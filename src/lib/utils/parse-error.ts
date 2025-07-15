import { AxiosError } from "axios";
import { APIErrorResponse } from "@/types/api-error";

export function getErrorMessage(error: unknown): string {
  const axiosErr = error as AxiosError<APIErrorResponse>;

  if (axiosErr?.response?.data?.message) {
    return axiosErr.response.data.message;
  }

  if (axiosErr?.message) {
    return axiosErr.message;
  }

  return "Something went wrong. Please try again.";
}
