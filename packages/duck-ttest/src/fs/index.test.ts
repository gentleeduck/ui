import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { BasenameOf, DirnameOf, ExtensionOf, IsAbsolute, JoinPaths, NormalizePath, StemOf } from '.'

// IsAbsolute
type Test_Posix_Abs = AssertTrue<IsAbsolute<'/a/b'>, "'/a/b' is absolute">
type Test_Rel = AssertFalse<IsAbsolute<'a/b'>, "'a/b' is relative">
type Test_Win_Abs = AssertTrue<IsAbsolute<'C:\\projects'>, "'C:\\projects' is absolute">

// ExtensionOf
type Test_Ext_Simple = AssertTrue<Equal<ExtensionOf<'foo.ts'>, '.ts'>, 'foo.ts → .ts'>
type Test_Ext_Double = AssertTrue<Equal<ExtensionOf<'index.d.ts'>, '.ts'>, 'index.d.ts → .ts'>
type Test_Ext_None = AssertTrue<Equal<ExtensionOf<'Makefile'>, ''>, 'Makefile has no extension'>
type Test_Ext_Path = AssertTrue<Equal<ExtensionOf<'/a/b/foo.png'>, '.png'>, 'picks basename extension'>

// BasenameOf / DirnameOf
type Test_Basename = AssertTrue<Equal<BasenameOf<'/a/b/c.txt'>, 'c.txt'>, 'basename'>
type Test_Basename_Flat = AssertTrue<Equal<BasenameOf<'foo.ts'>, 'foo.ts'>, 'basename of flat path'>
type Test_Dirname = AssertTrue<Equal<DirnameOf<'/a/b/c.txt'>, '/a/b'>, 'dirname'>
type Test_Dirname_Flat = AssertTrue<Equal<DirnameOf<'foo.ts'>, ''>, 'flat path has empty dirname'>

// StemOf
type Test_Stem = AssertTrue<Equal<StemOf<'foo.ts'>, 'foo'>, 'stem of foo.ts'>
type Test_Stem_Double = AssertTrue<Equal<StemOf<'index.d.ts'>, 'index.d'>, 'stem of index.d.ts'>

// JoinPaths
type Test_Join = AssertTrue<Equal<JoinPaths<'a/b', 'c/d'>, 'a/b/c/d'>, 'join with slash'>
type Test_Join_TrailingSlash = AssertTrue<Equal<JoinPaths<'a/', 'b'>, 'a/b'>, 'trailing slash collapses'>
type Test_Join_Empty = AssertTrue<Equal<JoinPaths<'', 'a'>, 'a'>, 'empty lhs'>

// NormalizePath
type Test_Norm_Dot = AssertTrue<Equal<NormalizePath<'/a/./b'>, '/a/b'>, "strips './'">
type Test_Norm_DotDot = AssertTrue<Equal<NormalizePath<'/a/b/../c'>, '/a/c'>, 'collapses ..'>
type Test_Norm_Multiple = AssertTrue<Equal<NormalizePath<'/a/./b/../c'>, '/a/c'>, 'mixed dot/..'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Posix_Abs,
  Test_Rel,
  Test_Win_Abs,
  Test_Ext_Simple,
  Test_Ext_Double,
  Test_Ext_None,
  Test_Ext_Path,
  Test_Basename,
  Test_Basename_Flat,
  Test_Dirname,
  Test_Dirname_Flat,
  Test_Stem,
  Test_Stem_Double,
  Test_Join,
  Test_Join_TrailingSlash,
  Test_Join_Empty,
  Test_Norm_Dot,
  Test_Norm_DotDot,
  Test_Norm_Multiple,
]
