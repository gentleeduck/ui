import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { BuildPath, MatchRoute, PathParams, QueryParams, SplitPath } from '.'

// PathParams
type Test_PathParams_Single = AssertTrue<
  Equal<PathParams<'/users/:id'>, { id: string }>,
  "extracts { id } from '/users/:id'"
>
type Test_PathParams_Multi = AssertTrue<
  Equal<PathParams<'/users/:id/posts/:postId'>, { id: string; postId: string }>,
  'extracts multi param record'
>
type Test_PathParams_None = AssertTrue<Equal<PathParams<'/static'>, Record<string, never>>, 'no params → empty record'>

// BuildPath
type Test_BuildPath_Single = AssertTrue<Equal<BuildPath<'/users/:id', { id: '42' }>, '/users/42'>, 'substitutes :id'>
type Test_BuildPath_Multi = AssertTrue<
  Equal<BuildPath<'/users/:id/posts/:postId', { id: 'a'; postId: 'b' }>, '/users/a/posts/b'>,
  'substitutes multiple params'
>

// SplitPath
type Test_SplitPath = AssertTrue<
  Equal<SplitPath<'/users/42/posts'>, ['users', '42', 'posts']>,
  'SplitPath drops leading empty segment'
>

// MatchRoute
type Test_Match_Hit = AssertTrue<MatchRoute<'/users/:id', '/users/42'>, "matches '/users/:id'">
type Test_Match_Miss = AssertFalse<MatchRoute<'/users/:id', '/posts/42'>, 'wrong base segment'>
type Test_Match_LengthMismatch = AssertFalse<MatchRoute<'/users/:id', '/users/42/extra'>, 'path longer than pattern'>
type Test_Match_Static = AssertTrue<MatchRoute<'/about', '/about'>, "matches static path '/about'">

// QueryParams
type Test_QueryParams = AssertTrue<
  Equal<QueryParams<'?id=42&name=ada'>, { id: string; name: string }>,
  'extracts query keys'
>
type Test_QueryParams_Full = AssertTrue<
  Equal<QueryParams<'/users?id=42'>, { id: string }>,
  'extracts query keys after path'
>
type Test_QueryParams_None = AssertTrue<Equal<QueryParams<'/users'>, Record<string, never>>, 'no query → empty record'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_PathParams_Single,
  Test_PathParams_Multi,
  Test_PathParams_None,
  Test_BuildPath_Single,
  Test_BuildPath_Multi,
  Test_SplitPath,
  Test_Match_Hit,
  Test_Match_Miss,
  Test_Match_LengthMismatch,
  Test_Match_Static,
  Test_QueryParams,
  Test_QueryParams_Full,
  Test_QueryParams_None,
]
