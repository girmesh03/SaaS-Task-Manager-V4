/**
 * @file Base RTK Query API slice definitions.
 */
import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "./axiosBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  }),
  tagTypes: [
    "Auth",
    "Organization",
    "Department",
    "User",
    "Task",
    "TaskActivity",
    "Comment",
    "Attachment",
    "Material",
    "Vendor",
    "Notification",
    "Dashboard",
    "Settings",
    "Search",
    "Platform",
  ],
  endpoints: (builder) => ({
    getCsrfToken: builder.query({
      query: () => ({
        url: "/auth/csrf",
      }),
      providesTags: ["Auth"],
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        data: {},
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        data: {},
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetCsrfTokenQuery,
  useRefreshMutation,
  useLogoutMutation,
} = apiSlice;
