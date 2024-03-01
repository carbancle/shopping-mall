export interface LandingStatus {
  skip: number;
  limit: number;
  loadMore?: boolean;
  filters?: {};
  searchTerm?: string;
}
