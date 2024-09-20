import { Button } from "bumbag"
import React from "react"
import { useFormContext } from "react-hook-form"
import ImageUploadButton from "../../file/upload/ImageUploadButton"
import { NormalLabel as Label } from "../../form/Label"
import { Trans } from "../../i18n"
import Input from "../../input/Input"
import { NumberInputField } from "../../input/NumberInput"
import { BankAccountTrans } from "../../trans/Payment"
import { PhoneTrans, RealNameTrans } from "../../trans/User"
import { isDepositPlatformPayment } from "./BrandPaymentTransferType"

const BankTransfer = "BankTransfer"
const ThirdParty = "ThirdParty"
const FPS = "FPS"
const USDT = "USDT"
const Usdt = "Usdt"
const EWallet = "EWallet"
const Pulsa = "Pulsa"
const Coinsph = "Coinsph"

export const PaymentMethodSetting = ({
  brandId,
  paymentCode,
  paymentMethodCode
}) => {
  let { getValues } = useFormContext()
  const transferType = getValues("transferType")
  let isDeposit = isDepositPlatformPayment(transferType)

  switch (paymentMethodCode) {
    case BankTransfer:
      return (
        <BankTransferSetting
          brandId={brandId}
          paymentCode={paymentCode}
          isDeposit={isDeposit}
        />
      )
    case ThirdParty:
      return (
        <ThirdPartySetting
          brandId={brandId}
          paymentCode={paymentCode}
          isDeposit={isDeposit}
        />
      )
    case FPS:
      return (
        <FPSSetting
          brandId={brandId}
          paymentCode={paymentCode}
          isDeposit={isDeposit}
        />
      )
    case USDT:
    case Usdt:
      return (
        <CryptoSetting
          brandId={brandId}
          currency="USDT"
          paymentCode={paymentCode}
          isDeposit={isDeposit}
        />
      )
    case EWallet:
      return (
        <EWalletSetting
          brandId={brandId}
          paymentCode={paymentCode}
          isDeposit={isDeposit}
        />
      )
    case Pulsa:
      return (
        <PulsaSetting
          brandId={brandId}
          paymentCode={paymentCode}
          isDeposit={isDeposit}
        />
      )
    case Coinsph:
      return (
        <CoinsphSetting
          brandId={brandId}
          paymentCode={paymentCode}
          isDeposit={isDeposit}
        />
      )
    default:
      return null
  }
}

const CoinsphSetting = ({ brandId, paymentCode, isDeposit }) => {
  const required = isNotWithdrawManual(paymentCode, isDeposit)
  return (
    <>
      <Label required={required}>
        <PhoneTrans />
      </Label>
      <Input name="extendedData.phone" required={required} />
      <Label required={required}>
        <RealNameTrans />
      </Label>
      <Input name="extendedData.name" required={required} />
      <Label>
        <Trans zh="QR Code" en="QR Code" />
      </Label>
      <ImageUploadButton
        brandId={brandId}
        name="extendedData.qrCode"
        prefix="payment"
        showLocalizationAddonAfter={false}
        required={required}
      />
    </>
  )
}

const PulsaSetting = ({ brandId, paymentCode, isDeposit }) => {
  const required = isNotWithdrawManual(paymentCode, isDeposit)

  return (
    <>
      <Label required={required}>
        <PhoneTrans />
      </Label>
      <Input name="extendedData.phone" required={required} />
    </>
  )
}

const EWalletSetting = ({ brandId, paymentCode, isDeposit }) => {
  const required = isNotWithdrawManual(paymentCode, isDeposit)
  return (
    <>
      <Label required={required}>
        <PhoneTrans />
      </Label>
      <Input name="extendedData.phone" required={required} />

      <Label required={required}>
        <Trans zh="E-money Name" en="E-money Name" />
      </Label>
      <Input name="extendedData.eMoneyName" required={required} />

      <Label required={required}>
        <Trans zh="QR Code" en="QR Code" />
      </Label>
      <ImageUploadButton
        brandId={brandId}
        name="extendedData.qrCode"
        prefix="payment"
        showLocalizationAddonAfter={false}
        required={required}
      />
    </>
  )
}

const CryptoSetting = ({ brandId, paymentCode, isDeposit, currency = "" }) => {
  const required = isNotWithdrawManual(paymentCode, isDeposit)
  return (
    <>
      <Label required={required}>
        <Trans zh="钱包地址" en="Wallet Address" />
      </Label>
      <Input name="extendedData.address" required={required} />
      <Label required={required}>
        <Trans zh="QR Code" en="QR Code" />
      </Label>
      <ImageUploadButton
        brandId={brandId}
        name="extendedData.qrCode"
        prefix="payment"
        showLocalizationAddonAfter={false}
        required={required}
      />
      <Label required={required}>
        <Trans zh="匯率" en="Exchange rate" />
      </Label>
      <NumberInputField
        name="extendedData.rate"
        addonBefore={
          <Button isStatic>
            <Trans zh="1 平台幣值 ＝" en="Currency" />
          </Button>
        }
        addonAfter={<Button isStatic>{currency}</Button>}
        min={0}
        step={0.0001}
        registerOptions={{
          valueAsNumber: true
        }}
        required={required}
      />
    </>
  )
}

const FPSSetting = ({ brandId, paymentCode, isDeposit }) => {
  const required = isNotWithdrawManual(paymentCode, isDeposit)
  return (
    <>
      <Label required={required}>
        <PhoneTrans />
      </Label>
      <Input name="extendedData.phone" required={required} />

      <Label required={required}>
        <Trans zh="电子邮件" en="Email" />
      </Label>
      <Input name="extendedData.email" required={required} />

      <Label required={required}>
        <Trans zh="FPS ID" en="FPS ID" />
      </Label>
      <Input name="extendedData.fpsId" required={required} />

      <Label required={required}>
        <Trans zh="QR Code" en="QR Code" />
      </Label>
      <ImageUploadButton
        brandId={brandId}
        name="extendedData.qrCodeFileUrl"
        prefix="payment"
        showLocalizationAddonAfter={false}
        required={required}
      />
    </>
  )
}

const ManualCode = "Manual"
const BankTransferSetting = ({ brandId, paymentCode, isDeposit }) => {
  let isManualPaymentCode = paymentCode === ManualCode
  return (
    <>
      {isManualPaymentCode && (
        <>
          <Label required={isDeposit}>
            <Trans zh="帐号名称" en="Account Name" />
          </Label>
          <Input name="extendedData.name" required={isDeposit} />
        </>
      )}

      {isManualPaymentCode && (
        <>
          <Label required={isDeposit}>
            <BankAccountTrans />
          </Label>
          <Input name="extendedData.bankAccount" required={isDeposit} />
        </>
      )}

      <Label>
        <Trans zh="銀行Logo" en="Bank Logo" />
      </Label>
      <ImageUploadButton
        brandId={brandId}
        name="extendedData.logo"
        prefix="payment"
        showLocalizationAddonAfter={false}
      />
    </>
  )
}

const ThirdPartySetting = ({ brandId, paymentCode, isDeposit }) => {
  const required = isNotWithdrawManual(paymentCode, isDeposit)
  return (
    <>
      <Label required={required}>
        <Trans zh="QR Code" en="QR Code" />
      </Label>
      <ImageUploadButton
        brandId={brandId}
        name="extendedData.qrCode"
        prefix="payment"
        showLocalizationAddonAfter={false}
        required={required}
      />
    </>
  )
}

const isManual = (paymentCode) => paymentCode === ManualCode
const isNotWithdrawManual = (paymentCode, isDeposit) =>
  isManual(paymentCode) || isDeposit
