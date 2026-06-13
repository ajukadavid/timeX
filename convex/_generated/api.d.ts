/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as attendance from "../attendance.js";
import type * as departments from "../departments.js";
import type * as http from "../http.js";
import type * as invites from "../invites.js";
import type * as lib_attendanceHelpers from "../lib/attendanceHelpers.js";
import type * as lib_auth from "../lib/auth.js";
import type * as migrations from "../migrations.js";
import type * as roles from "../roles.js";
import type * as settings from "../settings.js";
import type * as staff from "../staff.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  attendance: typeof attendance;
  departments: typeof departments;
  http: typeof http;
  invites: typeof invites;
  "lib/attendanceHelpers": typeof lib_attendanceHelpers;
  "lib/auth": typeof lib_auth;
  migrations: typeof migrations;
  roles: typeof roles;
  settings: typeof settings;
  staff: typeof staff;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
