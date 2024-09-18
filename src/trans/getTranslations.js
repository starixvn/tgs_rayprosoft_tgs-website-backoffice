import translations from "./trans-json"

const Locale = {
  en: "en",
  zh: "zh",
  th: "th",
  vi: "vi"
}

const getTransByLocale = (locale, item) => {
  const pathParts = item.split(".")
  let result = translations[locale]
  for (const part of pathParts) {
    if (result && result[part] !== undefined) {
      result = result[part]
    } else {
      return undefined
    }
  }

  return result
}

const getTranslations = (item) => {
  return {
    th: getTransByLocale(Locale.th, item),
    en: getTransByLocale(Locale.en, item),
    vi: getTransByLocale(Locale.vi, item),
    zh: getTransByLocale(Locale.zh, item)
  }
}

export default getTranslations
