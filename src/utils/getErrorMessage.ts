import axios from "axios";

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      "Unable to publish inventory."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to publish inventory.";
}