export type ApiResponse = {
  message: string;
};

export interface FetchQueryError {
  data: ApiResponse;
  status: 500;
}
