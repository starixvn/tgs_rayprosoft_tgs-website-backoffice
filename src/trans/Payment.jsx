import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"
import getTrans from "./getTrans"

export const DepositList = {
  ...getTrans("Payment.DepositList"),
  zh: "存款列表",
  en: "Deposit List",
  vi: "Lịch sử nạp"
}
export const DepositListTrans = () => <Trans {...DepositList} />

export const WithdrawList = {
  ...getTrans("Payment.WithdrawList"),
  zh: "提款列表",
  en: "Withdraw List",
  vi: "Danh sách rút tiền"
}
export const WithdrawListTrans = () => <Trans {...WithdrawList} />

const ChannelName = {
  ...getTrans("Payment.ChannelName"),
  zh: "通道名称",
  en: "Channel Name",
  vi: "Tên kênh"
}
export const ChannelNameTrans = () => <Trans {...ChannelName} />
export const useChannelNameTrans = () => useTrans(ChannelName)

const PaymentProvider = {
  ...getTrans("Payment.PaymentProvider"),
  zh: "金流商",
  en: "Payment Provider",
  vi: "Tên kênh"
}
export const PaymentProviderTrans = () => <Trans {...PaymentProvider} />
export const usePaymentProviderTrans = () => useTrans(PaymentProvider)

const PaymentMethod = {
  ...getTrans("Payment.PaymentMethod"),
  zh: "支付方式",
  en: "Payment Method",
  vi: "Phương thức thanh toán"
}
export const PaymentMethodTrans = () => <Trans {...PaymentMethod} />
export const usePaymentMethodTrans = () => useTrans(PaymentMethod)

const DepositPaymentMethod = {
  ...getTrans("Payment.DepositPaymentMethod"),
  zh: "存款类型",
  en: "Payment Method",
  vi: "Loại tiền gửi"
}
export const DepositPaymentMethodTrans = () => (
  <Trans {...DepositPaymentMethod} />
)
export const useDepositPaymentMethodTrans = () => useTrans(DepositPaymentMethod)

const PaymentName = {
  ...getTrans("Payment.PaymentName"),
  zh: "通道名称",
  en: "Payment Name",
  vi: "Tên kênh"
}
export const PaymentNameTrans = () => <Trans {...PaymentName} />

const DepositAmount = {
  ...getTrans("Payment.DepositAmount"),
  zh: "存款金额",
  en: "Deposit Amount",
  vi: "Số tiền gửi"
}
export const DepositAmountTrans = () => <Trans {...DepositAmount} />
export const useDepositAmountTrans = () => useTrans(DepositAmount)

const ActualDepositAmount = {
  ...getTrans("Payment.ActualDepositAmount"),
  zh: "实际存款金额",
  en: "Actual Amount",
  vi: "Số tiền gửi thực tế"
}
export const ActualDepositAmountTrans = () => <Trans {...ActualDepositAmount} />

const ActualWithdrawAmount = {
  ...getTrans("Payment.ActualWithdrawAmount"),
  zh: "实际提款金额",
  en: "Actual Amount",
  vi: "Số tiền rút thực tế"
}
export const ActualWithdrawAmountTrans = () => (
  <Trans {...ActualWithdrawAmount} />
)

const TransferFee = {
  ...getTrans("Payment.TransferFee"),
  zh: "手续费",
  en: "Transfer Fee",
  vi: "Phí xử lý"
}
export const TransferFeeTrans = () => <Trans {...TransferFee} />

const WaitingPayment = {
  ...getTrans("Payment.WaitingPayment"),
  zh: "待支付",
  en: "Waiting Payment",
  vi: "Đang chờ thanh toán"
}
export const WaitingPaymentTrans = (props) => (
  <Trans {...WaitingPayment} {...props} />
)
export const useWaitingPaymentTrans = () => useTrans(WaitingPayment)

const PaidTime = {
  ...getTrans("Payment.PaidTime"),
  zh: "已支付时间",
  en: "Paid Time",
  vi: "Thời gian thanh toán"
}
export const PaidTimeTrans = () => <Trans {...PaidTime} />

const WithdrawAmount = {
  ...getTrans("Payment.WithdrawAmount"),
  zh: "提款金额",
  en: "Amount",
  vi: "Số tiền rút"
}
export const WithdrawAmountTrans = () => <Trans {...WithdrawAmount} />

const Currency = {
  ...getTrans("Payment.Currency"),
  zh: "币种",
  en: "Currency",
  vi: "Loại tiền"
}
export const CurrencyTrans = () => <Trans {...Currency} />

export const Bank = {
  ...getTrans("Payment.Bank"),
  zh: "银行卡",
  en: "Bank"
}
export const BankTrans = () => <Trans {...Bank} />
export const useBankTrans = () => useTrans(Bank)

const BankInfo = {
  ...getTrans("Payment.BankInfo"),
  zh: "银行卡信息",
  en: "Bank",
  vi: "Thông tin thẻ ngân hàng"
}
export const BankInfoTrans = () => <Trans {...BankInfo} />

const BankCardField = {
  ...getTrans("Payment.BankCardField"),
  zh: "银行卡栏位",
  en: "Bank Card Field",
  vi: "Tìm  kiếm thẻ ngân hàng"
}
export const useBankCardFieldTrans = () => useTrans(BankCardField)

const BankAccount = {
  ...getTrans("Payment.BankAccount"),
  zh: "银行卡号",
  en: "Bank Account",
  vi: "Số thẻ ngân hàng"
}
export const useBankAccountTrans = () => useTrans(BankAccount)
export const BankAccountTrans = () => <Trans {...BankAccount} />

const WithdrawAndCanceled = {
  ...getTrans("Payment.WithdrawAndCanceled"),
  zh: "提款(包含已取消提款)",
  en: "Withdrawal/Canceled Withdrawal"
}
export const WithdrawAndCanceledTrans = () => <Trans {...WithdrawAndCanceled} />
export const useWithdrawAndCanceledTrans = () => useTrans(WithdrawAndCanceled)

const WithdrawCanceled = {
  ...getTrans("Payment.WithdrawCanceled"),
  zh: "取消提款",
  en: "Cancel Withdrawal"
}
export const WithdrawCanceledTrans = () => <Trans {...WithdrawCanceled} />
export const useWithdrawCanceledTrans = () => useTrans(WithdrawCanceled)

const WithdrawCompleted = {
  ...getTrans("Payment.WithdrawCompleted"),
  zh: "提款完成",
  en: "Complete Withdrawal"
}
export const WithdrawCompletedTrans = () => <Trans {...WithdrawCompleted} />

const TransferAndCanceled = {
  ...getTrans("Payment.TransferAndCanceled"),
  zh: "转帐(含转帐取消)",
  en: "Transfer (Includes Canceled Transfer)"
}
export const TransferAndCanceledTrans = () => <Trans {...TransferAndCanceled} />
export const useTransferAndCanceledTrans = () => useTrans(TransferAndCanceled)

const TransferCanceled = {
  ...getTrans("Payment.TransferCanceled"),
  zh: "转帐取消",
  en: "Transfer Canceled"
}
export const TransferCanceledTrans = () => <Trans {...TransferCanceled} />
export const useTransferCanceled = () => useTrans(TransferCanceled)

const ManualPayout = {
  ...getTrans("Payment.ManualPayout"),
  zh: "手动派发",
  en: "Manual Payout"
}
export const ManualPayoutTrans = () => <Trans {...ManualPayout} />
export const useManualPayoutTrans = () => useTrans(ManualPayout)

const PayoutAmount = {
  ...getTrans("Payment.PayoutAmount"),
  zh: "派发金额",
  en: "Payout Amount"
}
export const PayoutAmountTrans = () => <Trans {...PayoutAmount} />

const BalanceChangeTypeTransfer = {
  ...getTrans("Payment.BalanceChangeTypeTransfer"),
  zh: "轉出",
  en: "Transfer Out"
}
export const BalanceChangeTypeTransferTrans = () => (
  <Trans {...BalanceChangeTypeTransfer} />
)
export const useBalanceChangeTypeTransferTrans = () =>
  useTrans(BalanceChangeTypeTransfer)

const BalanceChangeTypeTransferRollback = {
  ...getTrans("Payment.BalanceChangeTypeTransferRollback"),
  zh: "轉出失敗",
  en: "Transfer Out Failed"
}
export const BalanceChangeTypeTransferRollbackTrans = () => (
  <Trans {...BalanceChangeTypeTransferRollback} />
)
export const useBalanceChangeTypeTransferRollbackTrans = () =>
  useTrans(BalanceChangeTypeTransferRollback)

const BalanceChangeTypeReceiveCommit = {
  ...getTrans("Payment.BalanceChangeTypeReceiveCommit"),
  zh: "轉入",
  en: "Transfer In"
}
export const BalanceChangeTypeReceiveCommitTrans = () => (
  <Trans {...BalanceChangeTypeReceiveCommit} />
)
export const useBalanceChangeTypeReceiveCommitTrans = () =>
  useTrans(BalanceChangeTypeReceiveCommit)

const BalanceChangeTypeReceiveRollback = {
  ...getTrans("Payment.BalanceChangeTypeReceiveRollback"),
  zh: "轉入失敗",
  en: "Transfer In Failed"
}
export const BalanceChangeTypeReceiveRollbackTrans = () => (
  <Trans {...BalanceChangeTypeReceiveRollback} />
)
export const useBalanceChangeTypeReceiveRollbackTrans = () =>
  useTrans(BalanceChangeTypeReceiveRollback)

export const FundManagement = {
  ...getTrans("Payment.FundManagement"),
  zh: "资金管理",
  en: "Fund management",
  vi: "Quản lý  ngân sách"
}
export const FundManagementTrans = () => <Trans {...FundManagement} />

export const PaymentManagement = {
  ...getTrans("Payment.PaymentManagement"),
  zh: "金流管理",
  en: "Payment Management",
  vi: "Quản lý tài chính"
}
export const PaymentManagementTrans = () => <Trans {...PaymentManagement} />

const Cash = {
  ...getTrans("Payment.Cash"),
  zh: "现金",
  en: "Cash",
  vi: "Tiền mặt"
}
export const CashTrans = () => <Trans {...Cash} />
export const useCashTrans = () => useTrans(Cash)

const FirstDepositCount = {
  ...getTrans("Payment.FirstDepositCount"),
  zh: "首存人数",
  en: "First Deposit Count",
  vi: "Số người nạp lần đầu"
}
export const FirstDepositCountTrans = () => <Trans {...FirstDepositCount} />

const NoSecondDepositPlayerCount = {
  ...getTrans("Payment.NoSecondDepositPlayerCount"),
  zh: "没进行第二次存款玩家人数",
  en: "No Second Deposit Player Count",
  vi: "Số người không nạp lại lần 2 "
}
export const NoSecondDepositPlayerCountTrans = () => (
  <Trans {...NoSecondDepositPlayerCount} />
)

const DepositPlayerCount = {
  ...getTrans("Payment.DepositPlayerCount"),
  zh: "当日玩家存款人数",
  en: "Deposit Player Count",
  vi: "Số lượng tiền gửi  người chơi trong ngày"
}
export const DepositPlayerCountTrans = () => <Trans {...DepositPlayerCount} />

const PaymentChannel = {
  ...getTrans("Payment.PaymentChannel"),
  zh: "支付通道",
  en: "Payment Channel",
  vi: "KKênhthanh toán"
}
export const PaymentChannelTrans = () => <Trans {...PaymentChannel} />
export const usePaymentChannelTrans = () => useTrans(PaymentChannel)

const PaymentLimit = {
  ...getTrans("Payment.PaymentLimit"),
  zh: "单笔限额",
  en: "Limit",
  vi: "Giới hạn mỗi đơn"
}
export const PaymentLimitTrans = () => <Trans {...PaymentLimit} />

const PaymentMinMaxLimit = {
  ...getTrans("Payment.PaymentMinMaxLimit"),
  zh: "单笔限额",
  en: "Min - Max",
  vi: "Giới hạn mỗi đơn"
}
export const PaymentMinMaxLimitTrans = () => <Trans {...PaymentMinMaxLimit} />

const Deposit = {
  ...getTrans("Payment.Deposit"),
  zh: "存款",
  en: "Deposit",
  vi: "Nạp tiền"
}
export const DepositTrans = () => <Trans {...Deposit} />
export const useDepositTrans = () => useTrans(Deposit)

const Withdraw = {
  ...getTrans("Payment.Withdraw"),
  zh: "提款",
  en: "Withdraw",
  vi: "Rút tiền"
}
export const WithdrawTrans = () => <Trans {...Withdraw} />
export const useWithdrawTrans = () => useTrans(Withdraw)

const ReviewingWithdrawal = {
  ...getTrans("Payment.ReviewingWithdrawal"),
  zh: "待處理提款",
  en: "Reviewing Withdrawal",
  vi: "Đang chờ xử lý rút tiền"
}
export const ReviewingWithdrawalTrans = () => <Trans {...ReviewingWithdrawal} />

const OutstandingWithdrawal = {
  ...getTrans("Payment.OutstandingWithdrawal"),
  zh: "待支付提款",
  en: "Outstanding Withdrawal",
  vi: "Đang chờ thanh toán"
}
export const OutstandingWithdrawalTrans = () => (
  <Trans {...OutstandingWithdrawal} />
)

const DepositApprovalRate = {
  ...getTrans("Payment.DepositApprovalRate"),
  zh: "存款成功率",
  en: "Deposit Approval Rate",
  vi: "Tỷ lệ nạp thành công"
}
export const DepositApprovalRateTrans = () => <Trans {...DepositApprovalRate} />

const ReviewWaitingPayment = {
  ...getTrans("Payment.ReviewWaitingPayment"),
  zh: "审核待支付",
  en: "Review Waiting Payment",
  vi: "khoản thanh toán đang chờ xử lý"
}
export const ReviewWaitingPaymentTrans = () => (
  <Trans {...ReviewWaitingPayment} />
)
export const useReviewWaitingPaymentTrans = () => useTrans(ReviewWaitingPayment)

const ConfirmPaid = {
  ...getTrans("Payment.ConfirmPaid"),
  zh: "确认已支付？",
  en: "Confirm paid？",
  vi: "xác nhận thanh toán ?"
}
export const ConfirmPaidTrans = () => <Trans {...ConfirmPaid} />

const MerchantBalance = {
  ...getTrans("Payment.MerchantBalance"),
  zh: "商户余额",
  en: "Merchant Balance",
  vi: "Số dư Tài khoản Công ty"
}
export const MerchantBalanceTrans = () => <Trans {...MerchantBalance} />
