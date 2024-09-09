import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useTrans, Trans } from "../../i18n"
import { Select } from "../../select/Select"
import { GameActionTypeLabel } from "../../game/GameActionType"
import PlayerAdjustBalanceType, {
  usePlayerAdjustBalanceTypeOptionList,
  PlayerAdjustBalanceTypeLabel
} from "../../player-management/balance-adjustment/PlayerAdjustBalanceType"
import { useTransactionTypeTrans } from "../../trans/Action"
import { DepositTrans, WithdrawTrans } from "../../trans/Payment"

const GameProviderDeposit = "GameProviderDeposit"
const GameProviderDepositTrans = {
  zh: "上分",
  en: "Game Deposit"
}

const GameProviderWithdrawal = "GameProviderWithdrawal"
const GameProviderWithdrawalTrans = {
  zh: "下分",
  en: "Game Withdrawal"
}

const UnsettledBetManual = "UnsettledBetManual"
const UnsettledBetManualTrans = {
  zh: "未结算单手动处理",
  en: "Unsettled Bet(Manual)"
}

// TODO: Phase 1 - Need add translation later
const GameProviderDeductBalance = "GameProviderDeductBalance"
const GameProviderDeductBalanceTrans = {
  zh: "Game Provider Deduct Balance",
  en: "Game Provider Deduct Balance"
}

// TODO: Phase 1 - Need add translation later
const GameProviderAddBalance = "GameProviderAddBalance"
const GameProviderAddBalanceTrans = {
  zh: "Game Provider Add Balance",
  en: "Game Provider Add Balance"
}

// TODO: Phase 1 - Need add translation later
const GameProviderAdjustBalance = "GameProviderAdjustBalance"
const GameProviderAdjustBalanceTrans = {
  zh: "Game Provider Adjust Balance",
  en: "Game Provider Adjust Balance"
}

const PromotionVipLevelUpgrade = "PromotionVipLevelUpgrade"
const PromotionVipLevelUpgradeTrans = {
  zh: "VIP晋升福利",
  en: "VIP Promotion Benefit"
}

const PromotionVipLevelSeason = "PromotionVipLevelSeason"
const PromotionVipLevelSeasonTrans = {
  zh: "VIP季度福利",
  en: "VIP Quarterly Benefit"
}

const PromotionVipLevelBirthday = "PromotionVipLevelBirthday"
const PromotionVipLevelBirthdayTrans = {
  zh: "VIP生日福利",
  en: "VIP Birthday Benefit"
}

const DividendAllAgentRebate = "DividendAllAgentRebate"
const DividendAllAgentRebateTrans = {
  zh: "全民代理返水",
  en: "All Agent Rebate"
}

const AdjustResettledBetManual = "AdjustResettledBetManual"
const AdjustResettledBetManualTrans = {
  zh: "已结算单再调整",
  en: "Settled Bet Readjusted"
}

const GameProviderFundIn = "GameProviderFundIn"
const GameProviderFundInTrans = {
  zh: "游戏转入",
  en: "Game Fund In"
}

const GameProviderFundOut = "GameProviderFundOut"
const GameProviderFundOutTrans = {
  zh: "游戏转出",
  en: "Game Fund Out"
}

const Bonus = "Bonus"
const BonusTrans = {
  zh: "红利",
  en: "Bonus"
}

const Deposit = "Deposit"

const Withdrawal = "Withdrawal"

const Rebate = "Rebate"
const RebateTrans = {
  zh: "返水",
  en: "Commission Rebate"
}

const Dividend = "Dividend"
const DividendTrans = {
  zh: "分紅",
  en: "Profit Sharing"
}

const Promotion = "Promotion"
const PromotionTrans = {
  zh: "活动",
  en: "Promotion"
}

const CancelWithdrawal = "CancelWithdrawal"
const CancelWithdrawalTrans = {
  zh: "取消提款",
  en: "Cancel Withdrawal"
}

export const TransactionTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTransactionTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let playerAdjustOptions = usePlayerAdjustBalanceTypeOptionList()
  let options = [
    ...playerAdjustOptions,
    {
      label: useTrans(RebateTrans),
      value: Rebate
    },
    {
      label: useTrans(PromotionTrans),
      value: Promotion
    },
    {
      label: useTrans(UnsettledBetManualTrans),
      value: UnsettledBetManual
    },
    {
      label: useTrans(GameProviderDeductBalanceTrans),
      value: GameProviderDeductBalance
    },
    {
      label: useTrans(GameProviderAddBalanceTrans),
      value: GameProviderAddBalance
    },
    {
      label: useTrans(GameProviderAdjustBalanceTrans),
      value: GameProviderAdjustBalance
    },
    {
      label: useTrans(AdjustResettledBetManualTrans),
      value: AdjustResettledBetManual
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const TransactionTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Bonus:
      return <Trans {...BonusTrans} />
    case GameProviderDeposit:
      return <Trans {...GameProviderDepositTrans} />
    case GameProviderWithdrawal:
      return <Trans {...GameProviderWithdrawalTrans} />
    case UnsettledBetManual:
      return <Trans {...UnsettledBetManualTrans} />
    case GameProviderDeductBalance:
      return <Trans {...GameProviderDeductBalanceTrans} />
    case GameProviderAddBalance:
      return <Trans {...GameProviderAddBalanceTrans} />
    case GameProviderAdjustBalance:
      return <Trans {...GameProviderAdjustBalanceTrans} />
    case PromotionVipLevelUpgrade:
      return <Trans {...PromotionVipLevelUpgradeTrans} />
    case PromotionVipLevelSeason:
      return <Trans {...PromotionVipLevelSeasonTrans} />
    case PromotionVipLevelBirthday:
      return <Trans {...PromotionVipLevelBirthdayTrans} />
    case DividendAllAgentRebate:
      return <Trans {...DividendAllAgentRebateTrans} />
    case AdjustResettledBetManual:
      return <Trans {...AdjustResettledBetManualTrans} />
    case Deposit:
      return <DepositTrans />
    case Withdrawal:
      return <WithdrawTrans />
    case PlayerAdjustBalanceType.Company:
    case PlayerAdjustBalanceType.Agent:
    case PlayerAdjustBalanceType.System:
    case PlayerAdjustBalanceType.Transfer:
    case PlayerAdjustBalanceType.Bonus:
      return <PlayerAdjustBalanceTypeLabel value={value} />
    case Rebate:
      return <Trans {...RebateTrans} />
    case Dividend:
      return <Trans {...DividendTrans} />
    case Promotion:
      return <Trans {...PromotionTrans} />
    case GameProviderFundIn:
      return <Trans {...GameProviderFundInTrans} />
    case GameProviderFundOut:
      return <Trans {...GameProviderFundOutTrans} />
    case CancelWithdrawal:
      return <Trans {...CancelWithdrawalTrans} />

    default:
      return <GameActionTypeLabel value={value} />
  }
}
