import React from "react"
import { Trans, useTrans } from "../../i18n"

const ResellerMessages = {
  zh: "总公司",
  en: "Reseller"
}
export const useResellerTrans = () => useTrans(ResellerMessages)
export const ResellerTrans = () => <Trans {...ResellerMessages} />
