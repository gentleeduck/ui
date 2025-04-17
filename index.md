# Backend Essentials: Pagination and Sessionless User Creation

This document explains how to:

1. Implement pagination in a backend service.
2. Handle user account creation when your API requires a session token for all other operations.

It includes SQL examples and integration notes for C++ backends.

---

## 1. Pagination: Backend Design

### Requirements

To implement pagination effectively, you need:

- `page` and `limit` query parameters (or `start` and `end`)
- An SQL query that fetches only the necessary rows
- (Optional) A total row count for the table, to help clients calculate the number of available pages
- You can pass these parameters as query parameters in a GET request or in the request body (optional)

### API Example

```
GET /products?page=2&limit=20
```

### SQL Example

```sql
SELECT * FROM products
ORDER BY created_at DESC
LIMIT 20 OFFSET 20;  -- (page - 1) * limit = (2 - 1) * 20 = 20
```

Alternatively, using `start` and `end` directly:

```
GET /products?start=20&end=40
```

```sql
SELECT * FROM products
ORDER BY created_at DESC
LIMIT 20 OFFSET 20;  -- end - start = 20 items, offset = start
```

### Getting the Total Row Count

To calculate how many pages are available on the client side:

```sql
SELECT COUNT(*) FROM products;
```

Client-side calculation:

```js
const totalPages = Math.ceil(totalCount / limit);
```

### Returning Count and Data Together

PostgreSQL supports returning both count and paginated results in one query using a Common Table Expression (CTE):

```sql
WITH paginated AS (
  SELECT * FROM products
  ORDER BY created_at DESC
  LIMIT 20 OFFSET 20
)
SELECT (SELECT COUNT(*) FROM products) AS total_count, *
FROM paginated;
```

This allows the backend to send both the data and the total count in one response.

---

## Optimizing for Large Datasets (Keyset Pagination)

Keyset pagination improves performance by avoiding large `OFFSET` values.

Instead of:

```sql
SELECT * FROM products
ORDER BY created_at DESC
LIMIT 20 OFFSET 10000;
```

Use:

```sql
SELECT * FROM products
WHERE created_at < '2025-01-01T00:00:00Z'
ORDER BY created_at DESC
LIMIT 20;
```

In this approach:

- The first page does not use a cursor.
- Subsequent pages use the `created_at` value of the last item from the previous page as a cursor.

### Backend API Example

```
GET /products?limit=20&cursor=2025-01-01T00:00:00Z
```

### Example in C++ using libpqxx

```cpp
pqxx::work txn{conn};
auto r = txn.exec_params(
    "SELECT * FROM products WHERE created_at < $1 ORDER BY created_at DESC LIMIT $2",
    cursor_time,
    limit
);
```

This method keeps performance consistent regardless of dataset size.

---

## Caching and Indexing

- **Indexing:** Strongly recommended. You should index the column used for pagination, such as `created_at` or `id`.
- **Caching:** Optional. Use caching (e.g., Redis) if the data is read frequently and does not change often.

---

## 2. Creating Users Without a Session Token

### Problem

If your API requires a session token for all endpoints, how can new users create accounts if they do not yet have a session?

### Solution

Allow unauthenticated access to certain endpoints, such as:

- `POST /register`
- `POST /login`

All other routes remain protected and require a valid session token.

### Example Access Control Logic in C++

```cpp
bool requires_auth(std::string_view path) {
    return !(path == "/login" || path == "/register");
}
```

### Do Not Use Backdoor Tokens

Avoid using a hardcoded session token or internal user account for unauthenticated operations. This poses a significant security risk.

Instead, implement proper access control logic that allows unauthenticated access to only specific public routes.

---

## Session Token Generation

Example of creating a session token after a successful registration or login:

```cpp
std::string generate_session_token() {
    return uuid_v4(); // Or generate a secure random token
}
```

Store the session in the database:

```sql
INSERT INTO sessions (user_id, token, created_at)
VALUES (123, 'abc123...', NOW());
```

Return the token in the response:

```json
{
  "token": "abc123...",
  "user_id": 123
}
```

---

## Pagination in C++ (libpqxx)

Example usage with `LIMIT` and `OFFSET`:

```cpp
pqxx::work txn{conn};
auto r = txn.exec_params(
    "SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    limit,
    offset
);
```

To build your API responses, use a JSON library such as [nlohmann/json](https://github.com/nlohmann/json).

---

## Summary

| Feature         | Description                                      |
|-----------------|--------------------------------------------------|
| Pagination      | Use `LIMIT` + `OFFSET`, or keyset pagination     |
| Indexing        | Required for efficient pagination                |
| Caching         | Optional, based on access patterns               |
| Public Endpoints| Allow unauthenticated access for registration    |
| Session Tokens  | Generate after successful login or registration |
| Backdoor Tokens | Not recommended; use explicit access control     |

