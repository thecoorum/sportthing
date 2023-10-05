import useSWR, { Fetcher } from "swr";

import { useApi } from "@/hooks/useApi";

import type {
  Employee,
  Params,
  EmployeeResponse,
  EmployeesResponse,
} from "./types";

export const useEmployees = (params: Params = {}) => {
  const api = useApi();

  const fetcher: Fetcher<Employee[], string> = (url) =>
    api
      .get(url, { params })
      .then((response: EmployeesResponse) => response.data.employees);

  const { data, error, isLoading } = useSWR("/employees", fetcher);

  return { data, error, loading: isLoading };
};

export const useEmployee = (id: number) => {
  const api = useApi();

  const fetcher: Fetcher<Employee, string> = (url) =>
    api.get(url).then((response: EmployeeResponse) => response.data.employee);

  const { data, error, isLoading } = useSWR(`/employees/${id}`, fetcher);

  return { data, error, loading: isLoading };
};
