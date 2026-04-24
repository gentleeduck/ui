import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  ContentType,
  HttpMethod,
  HttpStatusCode,
  IdempotentMethod,
  IsClientError,
  IsIdempotentMethod,
  IsSafeMethod,
  IsServerError,
  IsSuccess,
  SafeMethod,
  StatusFamily,
} from '.'

// Method classification
type Test_Safe_Get = AssertTrue<IsSafeMethod<'GET'>, 'GET is safe'>
type Test_Safe_Post = AssertFalse<IsSafeMethod<'POST'>, 'POST is not safe'>
type Test_Idempotent_Put = AssertTrue<IsIdempotentMethod<'PUT'>, 'PUT is idempotent'>
type Test_Idempotent_Post = AssertFalse<IsIdempotentMethod<'POST'>, 'POST is not idempotent'>

// StatusFamily
type Test_Family_200 = AssertTrue<Equal<StatusFamily<200>, '2xx'>, '200 is 2xx'>
type Test_Family_404 = AssertTrue<Equal<StatusFamily<404>, '4xx'>, '404 is 4xx'>
type Test_Family_500 = AssertTrue<Equal<StatusFamily<500>, '5xx'>, '500 is 5xx'>

// IsSuccess / IsClientError / IsServerError
type Test_IsSuccess = AssertTrue<IsSuccess<201>, '201 is success'>
type Test_IsClientError = AssertTrue<IsClientError<418>, '418 is client error'>
type Test_IsServerError = AssertTrue<IsServerError<503>, '503 is server error'>

// Sanity: HttpMethod includes all classical verbs
type Test_Methods = AssertTrue<
  Equal<Extract<HttpMethod, 'GET' | 'POST' | 'PUT' | 'DELETE'>, 'GET' | 'POST' | 'PUT' | 'DELETE'>,
  'HttpMethod contains the main verbs'
>

// ContentType sanity
type Test_JSON = AssertTrue<
  Equal<Extract<ContentType, 'application/json'>, 'application/json'>,
  'JSON is a content type'
>

// SafeMethod vs IdempotentMethod — safe ⊂ idempotent
type Test_Safe_Subset_Idempotent = AssertTrue<
  Equal<SafeMethod extends IdempotentMethod ? true : false, true>,
  'Safe methods are idempotent'
>

// HttpStatusCode covers 200/404/500
type Test_Codes = AssertTrue<
  Equal<200 | 404 | 500 extends HttpStatusCode ? true : false, true>,
  'HttpStatusCode covers common codes'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Safe_Get,
  Test_Safe_Post,
  Test_Idempotent_Put,
  Test_Idempotent_Post,
  Test_Family_200,
  Test_Family_404,
  Test_Family_500,
  Test_IsSuccess,
  Test_IsClientError,
  Test_IsServerError,
  Test_Methods,
  Test_JSON,
  Test_Safe_Subset_Idempotent,
  Test_Codes,
]
