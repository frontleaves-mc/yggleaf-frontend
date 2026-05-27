# src/api/ — API Layer

Dual-backend Axios layer: `authApiClient` (Auth /api-auth) + `mcApiClient` (MC /api-mc).
Core: `client.ts` (factory, snowflake guard, token refresh, response unwrap). Endpoints co-locate plain functions + TanStack Query hooks per resource.

## STRUCTURE

```
src/api/
├── client.ts                          # Axios factory, interceptors, ApiClient class
├── types/
│   ├── response.ts                    # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   ├── index.ts                       # Barrel export (all types)
│   ├── api-auth/                      # Auth backend types
│   │   ├── auth.ts                    # OAuthTokenData, TokenPair
│   │   ├── user.ts                    # User, GameProfile, Skin/Cape, Admin* types
│   │   ├── issue.ts                   # Issue CRUD types
│   │   └── sync.ts                    # ModFileMetadata
│   └── api-mc/                        # MC backend types
│       ├── title.ts                   # Title CRUD + enum
│       ├── achievement.ts             # Achievement + enum
│       ├── announcement.ts            # Announcement + enum
│       ├── announcement-schedule.ts   # Schedule types
│       ├── message.ts                 # Chat/Command log + SSE + enum
│       ├── server-management.ts       # Server CRUD
│       ├── server-status.ts           # PlayerStatusInfo
│       ├── server-load.ts             # Realtime + history load
│       ├── player-online.ts           # Online players
│       └── plugin-credential.ts       # Plugin auth
└── endpoints/
    ├── api-auth/                      # 13 files — auth, user, admin-*, game-profile, issue, issue-type, skin/cape-library, library-quota, mods-metadata
    └── api-mc/                        # 14 files — admin-achievement/announcement/schedule/message/plugin-credential/server/title, player-online/title, public-announcement, server-load/status, user-message
```

## WHERE TO LOOK

| Task                         | Location                                                                 |
| ---------------------------- | ------------------------------------------------------------------------ |
| Add new API endpoint         | `endpoints/api-auth/` or `endpoints/api-mc/` (pick by backend)           |
| Add new type                 | `types/api-auth/` or `types/api-mc/`, then re-export in `types/index.ts` |
| Change auth/token logic      | `client.ts` (interceptors) + `stores/auth-store.ts`                      |
| Change snowflake ID handling | `client.ts` → `UNSAFE_NUMBER_RE` regex + `safeParseJson()`               |
| Change error format          | `types/response.ts` → `ApiError` class                                   |
| Fix 401 refresh flow         | `client.ts` → `applyResponseInterceptor` + `refreshAccessToken()`        |
| Change timeout/base URL      | `config/constants.ts` → `API_TIMEOUT`, `API_BASE_URL`, `MC_API_BASE_URL` |

## CONVENTIONS

- **Two clients**: `authApiClient` for Auth endpoints, `mcApiClient` for MC endpoints. Never mix.
- **Endpoint file pattern**: plain `async function` (queryFn) + `useXxxQuery`/`useXxxMutation` hooks in same file.
- **Query keys**: `const XXX_QUERY_KEY = ['domain', 'resource'] as const`, exported for cross-file invalidation.
- **Business unwrap**: `ApiClient.get/post/…` auto unwrap `ApiResponse.data`. Callers get `T` directly.
- **Snowflake IDs**: ≥15 digit numbers auto-stringified in `transformResponse` before `JSON.parse`. All ID fields typed as `string`.
- **Auth skip**: pass `{ skipAuth: true }` as second/third arg for public endpoints.
- **Type imports**: use `#/api/types` barrel; avoid direct relative imports to sub-type files.
- **Enum exports**: runtime enums (e.g. `TitleType`, `MessageSource`) exported as values, not just types.

## ANTI-PATTERNS

- **Never** create a third Axios instance. Add endpoints to existing `authApiClient` or `mcApiClient`.
- **Never** bypass `ApiClient` methods with raw `instance.get()`. You lose unwrap + typing.
- **Never** `JSON.parse` response data manually. It's already parsed with snowflake protection.
- **Never** import types from `types/api-auth/user.ts` directly. Use `#/api/types` barrel.
- **Never** hardcode query keys inline. Always define and export `*_QUERY_KEY` constants.
- **Never** catch `ApiError` and swallow it silently. Let it propagate to TanStack Query's `onError`.
