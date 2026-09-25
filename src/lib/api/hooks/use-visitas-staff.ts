import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { paths } from "@/lib/api/generated/schema";

type VisitasStaffParams = NonNullable<
  paths["/visitas"]["get"]["parameters"]["query"]
>;

export function useVisitasStaff(params: VisitasStaffParams) {
  return useQuery({
    queryKey: ["visitas-staff", params],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/visitas", {
        params: { query: params },
      });
      if (error) throw toApiError(error, response);
      return data;
    },
  });
}
