import React from "react"
import { useTrans } from "../../i18n"
import BrandPaymentTransferType from "../../system/brandpayments/BrandPaymentTransferType"
import { useBrandPaymentList } from "../../system/brandpayments/client"
import { PaymentMethodBankTypeSelect } from "./PaymentMethodBankType"

export const PlayerBrandPaymentMethodBankTypeSelect = ({
  placeholder,
  paymentList,
  isPaymentListLoading,
  brandId,
  transferType = BrandPaymentTransferType.Withdrawal,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "支付类型",
    en: "Payment Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let { isLoading, data, error } = useBrandPaymentList(
    brandId
      ? {
          brandId,
          transferType,
          showAll: true
        }
      : undefined
  )
  let range = paymentList
    ? paymentList?.map(({ methodId }) => methodId)
    : data?.items?.map(({ paymentMethodId }) => paymentMethodId)

  return (
    <PaymentMethodBankTypeSelect
      isLoading={isLoading || isPaymentListLoading}
      range={range}
      {...props}
    />
  )
}
