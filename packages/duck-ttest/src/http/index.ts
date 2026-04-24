// HTTP-level string types.

/** The 9 HTTP methods defined by RFC 9110 + PATCH (RFC 5789). */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'

/** Methods considered safe (do not modify server state). */
export type SafeMethod = 'GET' | 'HEAD' | 'OPTIONS' | 'TRACE'

/** Methods that are idempotent per HTTP spec. */
export type IdempotentMethod = 'GET' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'PUT' | 'DELETE'

/** `true` if `M` is a safe (read-only) method. */
export type IsSafeMethod<M extends HttpMethod> = M extends SafeMethod ? true : false

/** `true` if `M` is an idempotent method. */
export type IsIdempotentMethod<M extends HttpMethod> = M extends IdempotentMethod ? true : false

/** 1xx — Informational. */
export type Informational = 100 | 101 | 102 | 103

/** 2xx — Success. */
export type Success = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226

/** 3xx — Redirection. */
export type Redirection = 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308

/** 4xx — Client error. */
export type ClientError =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451

/** 5xx — Server error. */
export type ServerError = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511

/** Every HTTP status code recognized by this module. */
export type HttpStatusCode = Informational | Success | Redirection | ClientError | ServerError

/** Grouping an HTTP status code by its class. */
export type StatusFamily<S extends HttpStatusCode> = S extends Informational
  ? '1xx'
  : S extends Success
    ? '2xx'
    : S extends Redirection
      ? '3xx'
      : S extends ClientError
        ? '4xx'
        : S extends ServerError
          ? '5xx'
          : never

/** Common `Content-Type` values. */
export type ContentType =
  | 'application/json'
  | 'application/xml'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'
  | 'application/pdf'
  | 'application/zip'
  | 'multipart/form-data'
  | 'text/plain'
  | 'text/html'
  | 'text/css'
  | 'text/javascript'
  | 'text/csv'
  | 'image/png'
  | 'image/jpeg'
  | 'image/gif'
  | 'image/svg+xml'
  | 'image/webp'
  | 'audio/mpeg'
  | 'audio/ogg'
  | 'video/mp4'
  | 'video/webm'

/** `true` if `S` is a success code (2xx). */
export type IsSuccess<S extends HttpStatusCode> = S extends Success ? true : false

/** `true` if `S` is a client error (4xx). */
export type IsClientError<S extends HttpStatusCode> = S extends ClientError ? true : false

/** `true` if `S` is a server error (5xx). */
export type IsServerError<S extends HttpStatusCode> = S extends ServerError ? true : false

/** A minimal URL-less request descriptor useful in type-safe clients. */
export interface HttpRequestShape<M extends HttpMethod = HttpMethod, Body = unknown> {
  method: M
  headers?: Record<string, string>
  body?: Body
}

/** A minimal response descriptor. */
export interface HttpResponseShape<S extends HttpStatusCode = HttpStatusCode, Body = unknown> {
  status: S
  headers?: Record<string, string>
  body: Body
}
