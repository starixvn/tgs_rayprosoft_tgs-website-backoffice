import React, { createContext, useContext, useState } from "react"
import { Text, DropdownMenu, Button } from "bumbag"
import numeral from "numeral"
import { registerLocale, setDefaultLocale } from "react-datepicker"
import { enUS, zhCN, th } from "date-fns/locale"
import {
  formatDateTime,
  formatHourMinuteSecondDayMonthYear,
  HourMinuteSecondDayMonthYear
} from "./date/format"
import { isObject } from "lodash-es"
import getTranslations from "./trans/getTranslations"

registerLocale("en", enUS)
registerLocale("zh", zhCN)
registerLocale("th", th)

const DefaultDateFormat = "yyyy/MM/dd"
const DefaultTimeFormat = "HH:mm:ss"

export const Locales = {
  en: "en",
  zh: "zh",
  vi: "vi",
  th: "th"
}

const defaultLocale = Locales.zh

const Store = createContext()

const Key = "lang"
//1. lang from localStorage
//2. lang from navigator.language
export const getAcceptLang = () => {
  let lang
  try {
    lang = localStorage.getItem(Key)
    if (lang) {
      return lang
    }
  } catch (error) {
    //ignore
  }

  lang = Object.values(Locales).reduce((result, lang) => {
    if (result) {
      return result
    }

    if (navigator.language.startsWith(lang)) {
      return lang
    }
  }, lang)

  return lang ?? Locales.en
}

export const getAcceptLangCulture = () => {
  let lang = getAcceptLang()
  switch (lang) {
    case Locales.zh:
      return "zh-CN"
    case Locales.vi:
      return "vi-VN"
    case Locales.th:
      return "th-TH"
    default:
      return "en-US"
  }
}

export const Provider = ({ value = getAcceptLang(), children }) => {
  let [locale, set] = useState(value)
  setDefaultLocale(locale)

  const setLocale = (locale) => {
    set(locale)
    setDefaultLocale(locale)
    try {
      localStorage.setItem(Key, locale)
    } catch (error) {
      //ignore
    }
  }

  return (
    <Store.Provider value={{ locale, setLocale }}>{children}</Store.Provider>
  )
}

export const useLocale = () => {
  let { locale } = useContext(Store) ?? {}
  return locale ?? defaultLocale
}

export const useEnglish = () => {
  let { setLocale } = useContext(Store)
  return () => setLocale(Locales.en)
}

export const useChinese = () => {
  let { setLocale } = useContext(Store)
  return () => setLocale(Locales.zh)
}

export const useVietnamese = () => {
  let { setLocale } = useContext(Store)
  return () => setLocale(Locales.vi)
}

export const useThai = () => {
  let { setLocale } = useContext(Store)
  return () => setLocale(Locales.th)
}

export const useLangCode = () => {
  let enUS = "en-US"
  let Default = enUS
  let { locale } = useContext(Store) ?? {}
  switch (locale) {
    case Locales.en:
      return enUS
    case Locales.zh:
      return "zh-CN"
    case Locales.vi:
      return "vi-VN"
    case Locales.th:
      return "th-TH"
  }
  return Default
}

export const useTrans = (messages = {}) => {
  let Default = Locales.en
  let locale = useLocale()

  const en = messages[Locales.en]
  const key = convertEnToKey(en)
  const translations = getTranslations(key)
  // Begin debug and collect translations
  //   if (messages[Locales.en] != "") {
  //     addTransInMemory(key, en)
  //   }
  //End debug and collect translations

  return messages[locale] ?? translations[locale] ?? messages[Default] ?? ""
}

export const convertEnToKey = (en) => {
  let key = en
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "_")
    .slice(0, 32)

  key = key.replace(/^_+|_+$/g, "")

  if (!/^[a-z]/i.test(key)) {
    key = key.slice(1)
  }
  if (!/[a-z]$/i.test(key)) {
    key = key.slice(0, -1)
  }

  return key
}

// Begin debug and collect translations
// const handleAddTranslation = async (object, lang) => {
//   try {
//     const response = await fetch("http://localhost:5001/api/translations/add", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ key, value, lang })
//     })

//     if (!response.ok) {
//       throw new Error("Network response was not ok")
//     }

//     const data = await response.json()
//     console.log("Success:", data)
//   } catch (error) {
//     console.error("Error:", error)
//   }
// }

// let transInMemory = {}

// const addTransInMemory = (key, value) => {
//   transInMemory[key] = value
// }
//End debug and collect translations

export const Trans = ({ en = "", zh = "", vi = "", th = "", ...props }) => {
  const key = convertEnToKey(en)
  // Begin debug and collect translations
  //   console.log("KEY:::: ", key)
  //   console.log("en zh vi th:::: ", en, zh, vi, th)

  //   if (en != "") {
  //     addTransInMemory(key, en)
  //   }
  //   console.log("transInMemory:::: ", transInMemory)
  // End debug and collect translations

  const translations = getTranslations(key)
  if (translations) {
    en = en || translations.en || ""
    zh = zh || translations.zh || ""
    vi = vi || translations.vi || ""
    th = th || translations.th || ""
  }

  let locale = useLocale()
  switch (locale) {
    case Locales.en:
      return <span {...props}>{en || ""}</span>
    case Locales.vi:
      return <span {...props}>{vi || en || ""}</span>
    case Locales.th:
      return <span {...props}>{th || en || ""}</span>
    default:
      return <span {...props}>{zh || en || ""}</span>
  }
}

export const FormattedDate = ({
  format = DefaultDateFormat,
  value,
  placeholder = ""
}) => {
  let formatted = formatDateTime(format, value)
  return <Text>{formatted ? formatted : placeholder}</Text>
}

export const FormattedDateTime = ({
  dateFormat = DefaultDateFormat,
  timeFormat = DefaultTimeFormat,
  value,
  placeholder = "",
  ...props
}) => {
  let format = `${dateFormat} ${timeFormat}`
  let formatted = formatDateTime(format, value)
  return <Text {...props}>{formatted ? formatted : placeholder}</Text>
}

export const FormatHourMinuteSecondDayMonthYear = ({
  value,
  placeholder = ""
}) => {
  let formatted = formatHourMinuteSecondDayMonthYear(value)
  return formatted ? formatted : placeholder
}

let MaxDigits = 20
export const FormattedNumber = ({
  value,
  digits,
  format = "0,0",
  postfix = "",
  placeholder = "",
  ...props
}) => {
  if (!Number.isFinite(value)) {
    return placeholder
  }

  if (Number.isInteger(digits) && digits >= 0 && digits <= MaxDigits) {
    value = value.toFixed(digits + 1).slice(0, -1)
  }
  return (
    <span {...props}>
      {numeral(value).format(format)}
      {postfix}
    </span>
  )
}

export const FormattedNumberDecimal = ({
  value,
  digits = 2,
  format = "0,0.00",
  prefix = "",
  postfix = "",
  placeholder = "",
  ...props
}) => {
  if (!Number.isFinite(value)) {
    return placeholder
  }

  if (Number.isInteger(digits) && digits >= 0 && digits <= MaxDigits) {
    value = value.toFixed(digits + 1).slice(0, -1)
  }
  return (
    <Text {...props}>
      {prefix}
      {numeral(value).format(format)}
      {postfix}
    </Text>
  )
}

export const FormattedNumberDecimalPercentage = ({
  postfix = "%",
  ...props
}) => <FormattedNumberDecimal postfix={postfix} {...props} />

export const getTrans = (messages = {}, locale = Locales.zh) => {
  if (isObject(messages)) {
    const en = Reflect.get(messages, Locales.en) ?? ""
    const key = convertEnToKey(en)
    const translations = getTranslations(key)
    if (translations) {
      return Reflect.get(messages, locale) ?? translations[locale] ?? en
    }
  }
  // isObject(messages)
  //   ? Reflect.get(messages, locale) ?? Reflect.get(messages, Locales.en) ?? ""
  //   : messages
}

export const LangDropdownMenu = ({ ...props }) => {
  let locale = useLocale()
  let chinese = "中文"
  let english = "English"
  let vietnamese = "Tiếng Việt" //"Vietnamese"
  let thai = "ไทย"

  let useEn = useEnglish()
  let useZh = useChinese()
  let useVi = useVietnamese()
  let useTh = useThai()

  return (
    <DropdownMenu
      menu={
        <>
          <DropdownMenu.Item onClick={useZh}>{chinese}</DropdownMenu.Item>
          <DropdownMenu.Item onClick={useEn}>{english}</DropdownMenu.Item>
          <DropdownMenu.Item onClick={useVi}>{vietnamese}</DropdownMenu.Item>
          <DropdownMenu.Item onClick={useTh}>{thai}</DropdownMenu.Item>
        </>
      }
    >
      <Button variant="ghost" iconAfter="chevron-down">
        {locale === Locales.zh && chinese}
        {locale === Locales.en && english}
        {locale === Locales.vi && vietnamese}
        {locale === Locales.th && thai}
      </Button>
    </DropdownMenu>
  )
}
