import React from "react"
import { Trans, useTrans } from "../i18n"
import getTrans from "./getTrans"

const BetLimitMessages = {
  ...getTrans("BetLimit.BetLimitMessages"),
  zh: "限红",
  en: "Bet Limit"
}
export const useBetLimitTrans = () => useTrans(BetLimitMessages)
export const BetLimitTrans = () => <Trans {...BetLimitMessages} />

const MinBetMessages = {
  ...getTrans("BetLimit.MinBetMessages"),
  zh: "最低投注",
  en: "Min Bet"
}
export const useBetLimitMinBetTrans = () => useTrans(MinBetMessages)
export const BetLimitMinBetTrans = () => <Trans {...MinBetMessages} />

const MaxBetMessages = {
  ...getTrans("BetLimit.MaxBetMessages"),
  zh: "最高投注",
  en: "Max Bet"
}
export const useBetLimitMaxBetTrans = () => useTrans(MaxBetMessages)
export const BetLimitMaxBetTrans = () => <Trans {...MaxBetMessages} />

const MaxBetPerMatchMessages = {
  ...getTrans("BetLimit.MaxBetPerMatchMessages"),
  zh: "单场最高投注",
  en: "Max Bet Per Match"
}
export const useBetLimitMaxBetPerMatchTrans = () =>
  useTrans(MaxBetPerMatchMessages)
export const BetLimitMaxBetPerMatchTrans = () => (
  <Trans {...MaxBetPerMatchMessages} />
)
