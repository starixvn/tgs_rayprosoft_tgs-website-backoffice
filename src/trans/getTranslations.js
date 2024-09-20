import translations from "./trans-json"
import { Locales } from "../i18n"

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
    th: getTransByLocale(Locales.th, item),
    en: getTransByLocale(Locales.en, item),
    vi: getTransByLocale(Locales.vi, item),
    zh: getTransByLocale(Locales.zh, item)
  }
}

export default getTranslations
