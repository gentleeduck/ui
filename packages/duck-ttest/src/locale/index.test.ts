import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { CountryCode, CurrencyCode, IsLocaleTag, LanguageCode, LocaleTag, TimeZone } from '.'

// Known codes accepted
type Test_Lang = AssertTrue<Equal<'en' extends LanguageCode ? true : false, true>, "'en' is a language code">
type Test_Country = AssertTrue<Equal<'US' extends CountryCode ? true : false, true>, "'US' is a country code">
type Test_Currency = AssertTrue<Equal<'USD' extends CurrencyCode ? true : false, true>, "'USD' is a currency">

// LocaleTag combines language and country
type Test_Locale_LangOnly = AssertTrue<IsLocaleTag<'fr'>, "'fr' is a locale">
type Test_Locale_Combined = AssertTrue<IsLocaleTag<'en-US'>, "'en-US' is a locale">
type Test_Locale_NotKnown = AssertFalse<IsLocaleTag<'xx-YY'>, "'xx-YY' is not a known locale">

// TimeZone sanity
type Test_TimeZone_UTC = AssertTrue<Equal<'UTC' extends TimeZone ? true : false, true>, "'UTC' is a TimeZone">

// LocaleTag shape equals LanguageCode | `${LanguageCode}-${CountryCode}`
type Test_LocaleTag_Shape = AssertTrue<
  Equal<LocaleTag, LanguageCode | `${LanguageCode}-${CountryCode}`>,
  'LocaleTag is language optionally followed by country'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Lang,
  Test_Country,
  Test_Currency,
  Test_Locale_LangOnly,
  Test_Locale_Combined,
  Test_Locale_NotKnown,
  Test_TimeZone_UTC,
  Test_LocaleTag_Shape,
]
