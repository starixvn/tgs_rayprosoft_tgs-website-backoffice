import { Button, useModalState } from "bumbag"
import clone from "clone-deep"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { SWRConfig } from "swr"
import AlertDialog from "../../dialog/Alert"
import { ReviewDisclosure } from "../../dialog/Disclosure"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { FormDialog } from "../../form/FormDialog"
import { useTrans } from "../../i18n"
import { RejectTrans, useApproveTrans } from "../../trans/Action"
import { useIsDisplayMenuByRoute } from "../../user/context"
import ReviewFund from "../ReviewFund"
import { AuditAutoClearBucketDialogDisclosure } from "./AuditAutoClearBucketDialog"
import { FormBody } from "./ViewFundWithdraw"
import { useFundWithdrawForm, useVerifyFundWithdrawForm } from "./client"
import { Update } from "./menu"

export const FundWithdrawVerified = "FundWithdrawVerified"

const fireVerifiedEvent = () => {
  let event = new Event(FundWithdrawVerified)
  document.dispatchEvent(event)
}

export const VerifyFundWithdrawDisclosure = ({
  brandId,
  formId,
  playerCode,
  onSubmitted,
  onVisibleChange,
  ...props
}) => {
  let dialog = useModalState()

  useEffect(() => {
    onVisibleChange?.(dialog.visible)
  }, [dialog.visible])

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ReviewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <VerifyFundWithdrawDialog
            brandId={brandId}
            formId={formId}
            playerCode={playerCode}
            onSubmitted={onSubmitted}
            dialog={dialog}
          />
        </SWRConfig>
      )}
    </>
  )
}

const VerifyFundWithdrawDialog = ({
  brandId,
  formId,
  playerCode,
  onSubmitted,
  dialog,
  ...props
}) => {
  let title = useTrans({
    zh: "提款审核",
    en: "Review Withdraw"
  })

  let approveLabel = useApproveTrans()

  let formMethods = useForm()
  let { setValue, getValues } = formMethods

  let {
    isLoading: isLoadingFundWithdrawForm,
    data: fundWithdrawForm,
    error: fundWithdrawFormError,
    mutate: mutateFundWithdrawForm,
    deleteCache: deleteFundWithdrawFormCache
  } = useFundWithdrawForm(brandId, formId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useVerifyFundWithdrawForm(brandId, formId, formData)

  if (isLoadingFundWithdrawForm) {
    return <LoadingBackdrop {...dialog} />
  }

  if (fundWithdrawFormError) {
    return <AlertDialog {...fundWithdrawFormError} {...dialog} />
  }

  const onSubmit = ({
    remark,
    playerRemark,
    reviewResponse,
    brandPaymentId,
    ...rest
  }) => {
    setSubmit({
      brandId,
      brandPaymentId,
      remark,
      playerRemark,
      reviewResponse
    })
  }

  const resetVerifyFundWithdrawForm = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  const reset = () => {
    deleteFundWithdrawFormCache()
    mutateFundWithdrawForm(undefined, false)

    resetVerifyFundWithdrawForm()
  }

  return (
    <FormDialog
      id="verify-withdraw-dialog"
      formMethods={formMethods}
      defaultValues={clone({ ...fundWithdrawForm })}
      actionButtonsProps={{
        isLoading: isLoading,
        disabled: isLoading,
        submitText: approveLabel,
        palette: "success",
        submitProps: {
          "data-type": "approve"
        }
      }}
      onClickSubmit={(event) => {
        setValue("reviewResponse", ReviewFund.Approve)
      }}
      addonButtons={
        <Button
          type="button"
          data-type="reject"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={() => {
            let formData = {
              brandId,
              remark: getValues("remark"),
              playerRemark: getValues("playerRemark"),
              reviewResponse: ReviewFund.Reject
            }
            setSubmit(formData)
          }}
          palette="danger"
          variant="outlined"
        >
          <RejectTrans />
        </Button>
      }
      footer={
        playerCode ? (
          <AuditAutoClearBucketDialogDisclosure
            disabled
            brandId={brandId}
            playerCode={playerCode}
          />
        ) : null
      }
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={resetVerifyFundWithdrawForm}
      onClickClose={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
        fireVerifiedEvent()
      }}
      title={title}
      dialog={dialog}
      maxWidth="80vw"
    >
      <FormBody
        brandId={brandId}
        record={fundWithdrawForm}
        showBalance={true}
      />
    </FormDialog>
  )
}
