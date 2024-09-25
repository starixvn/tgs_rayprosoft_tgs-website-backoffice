import { css } from "@emotion/react"
import {
  List as _List,
  applyTheme,
  Box,
  Button,
  Columns,
  Heading,
  Set,
  Stack,
  Text,
  useModalState
} from "bumbag"
import clone from "clone-deep"
import { head } from "lodash-es"
import React, { useEffect, useRef, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { SWRConfig } from "swr"
import { CheckboxField } from "../../checkbox/Checkbox"
import AlertDialog from "../../dialog/Alert"
import { AddDisclosure, EditDisclosure } from "../../dialog/Disclosure"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import FormDialog from "../../form/FormDialog"
import { NormalLabel as Label } from "../../form/Label"
import { Trans, useTrans } from "../../i18n"
import Input from "../../input/Input"
import { PercentageNumberInputField } from "../../input/NumberInput"
import { FieldValues } from "../../layout/Grid"
import { NumberRangeInputGroup } from "../../number/RangeInput"
import {
  PaymentChannelLabel,
  PaymentChannelSelect
} from "../../payment/channel/PaymentChannel"
import {
  usePaymentList,
  usePaymentMethodChannelList
} from "../../payment/client"
import {
  PaymentMethodLabel,
  PaymentMethodSelect
} from "../../payment/method/PaymentMethod"
import { PaymentProviderLabel } from "../../payment/PaymentProvider"
import { Switch } from "../../switch/Switch"
import Textarea from "../../textarea"
import { useAddTrans, useEditTrans } from "../../trans/Action"
import {
  ChannelNameTrans,
  DisplayConditionTrans,
  PaymentChannelTrans,
  PaymentLimitTrans,
  PaymentMethodTrans,
  PaymentProviderTrans,
  TransferFeeTrans
} from "../../trans/Payment"
import { StatusTrans } from "../../trans/Status"
import { useIsDisplayMenuByRoute } from "../../user/context"
import BrandPaymentStatus, {
  BrandPaymentStatusButton
} from "./BrandPaymentStatus"
import { isDepositPlatformPayment } from "./BrandPaymentTransferType"
import {
  useAddDepositBrandPayment,
  useAddWithdrawBrandPayment,
  useBrandPayment,
  useBrandPaymentUpload,
  useUpdateBrandPayment
} from "./client"
import {
  AccumulatedDepositText,
  AllPlayerText,
  IdentityAuthenticationText,
  PlayerListCondition,
  PlayerListConditionRadioGroup,
  UnlimitedText
} from "./condition"
import { Update as UpdateMenu } from "./menu"
import { PaymentMethodSetting } from "./PaymentMethodSetting"

export const EditButton = ({
  brandId,
  platformPaymentId,
  onSubmitted,
  id,
  dialogId,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <EditDisclosure id={id} {...dialog} />
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <EditDialog
            brandId={brandId}
            platformPaymentId={platformPaymentId}
            onSubmitted={onSubmitted}
            dialog={dialog}
            dialogId={dialogId}
          />
        </SWRConfig>
      )}
    </>
  )
}

const EditDialog = ({
  brandId,
  platformPaymentId,
  onSubmitted,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useEditTrans()

  let {
    isLoading: isLoadingPayment,
    record,
    manualPayment,
    manualPaymentMethodList,
    manualPaymentMethodChannelList,
    error: loadingPaymentError,
    mutate: mutatePlatformPayment,
    deleteCache: deletePlatformPaymentCache
  } = usePlatformPayment(platformPaymentId)

  let [submitData, setSubmit] = useState()

  let { result, isLoading, error, mutate, deleteCache } = useUpdateBrandPayment(
    platformPaymentId,
    submitData
  )

  if (isLoadingPayment) {
    return <LoadingBackdrop {...dialog} />
  }

  if (loadingPaymentError) {
    return <AlertDialog {...loadingPaymentError} onClickClose={dialog.hide} />
  }

  const resetPlatformPayment = () => {
    mutatePlatformPayment(undefined, false)
    deletePlatformPaymentCache()
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      id={dialogId}
      defaultValues={clone(record)}
      /*
      defaultValues={clone({
        ...record,
        reason: ""
      })}
      */
      onSubmit={(data) => {
        setSubmit({
          brandId,
          ...record,
          /*
                    ...brandPaymentData.payment,
                    */
          ...data,
          depositedAmountMax:
            data?.depositedAmountMax ?? record?.depositedAmountMax
        })
      }}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        resetPlatformPayment()
        reset()
        onSubmitted?.()
      }}
      title={title}
      showCloseButton
      width="80vw"
      height="95vh"
      maxHeight="95vh"
      placement="top"
      display="flex"
      flexDirection="column"
      css={css`
        & .bb-Flex.bb-DialogContent {
          max-height: 95vh;
          flex: 1 auto;
          padding-bottom: 0.5em;
        }

        & .bb-DialogContent > .bb-Box {
          display: flex;
          flex-direction: column;
        }
      `}
      dialog={dialog}
    >
      <EditBody
        brandId={brandId}
        record={record}
        manualPayment={manualPayment}
        manualPaymentMethodList={manualPaymentMethodList}
        manualPaymentMethodChannelList={manualPaymentMethodChannelList}
      />
    </FormDialog>
  )
}

export const AddBrandPaymentButton = ({
  brandId,
  transferType,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  let useFetch = isDepositPlatformPayment(transferType)
    ? useAddDepositBrandPayment
    : useAddWithdrawBrandPayment
  return (
    <>
      <AddDisclosure
        {...dialog}
        {...props}
        css={css`
          background: #4b49b6;
          color: #fff;
          border-radius: 6px !important;
          border: 1px solid !important;
          font-weight: 400;
          &:focus,
          &:hover,
          &:active {
            background: #4b49b6;
            box-shadow: none !important;
          }
          &:hover {
            &:active {
              background: #4b49b6;
            }
          }
        `}
      />
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <AddDialog
            id="add-payment-dialog"
            brandId={brandId}
            transferType={transferType}
            useFetch={useFetch}
            onSubmitted={onSubmitted}
            dialog={dialog}
          />
        </SWRConfig>
      )}
    </>
  )
}

const usePlatformPayment = (platformPaymentId) => {
  let {
    isLoading: isLoadingPlatformPayment,
    data: record,
    error: platformPaymentError,
    mutate,
    deleteCache
  } = useBrandPayment(platformPaymentId)

  let {
    isLoading: isLoadingPaymentList,
    data: paymentListData,
    error: paymentListError,
    mutate: mutatePaymentList,
    deleteCache: deletePaymentListCache
  } = usePaymentList()

  let {
    isLoading: isLoadingBrandPaymentMethodChannelList,
    data: paymentMethodChannelList,
    error: paymentMethodChannelListError,
    mutate: mutatePaymentMethodChannelList,
    deleteCache: deletePaymentMethodChannelListCache
  } = usePaymentMethodChannelList()

  let paymentCode = paymentListData?.find(
    ({ id }) => id === record?.paymentId
  )?.code

  let manualPayment = paymentListData?.find(({ code }) => code === "Manual")

  let manualPaymentMethodChannelList =
    paymentMethodChannelList?.allData?.filter?.(
      ({ paymentId }) => manualPayment.id === paymentId
    )

  let manualPaymentMethodIds = manualPaymentMethodChannelList?.map(
    ({ methodId }) => methodId
  )

  let manualPaymentMethodList = paymentMethodChannelList?.methods?.filter?.(
    ({ id }) => manualPaymentMethodIds?.includes(id)
  )

  return {
    isLoading:
      isLoadingPlatformPayment ||
      isLoadingPaymentList ||
      isLoadingBrandPaymentMethodChannelList,
    record: { ...clone(record), paymentCode },
    manualPayment,
    manualPaymentMethodList,
    manualPaymentMethodChannelList,
    error:
      platformPaymentError || paymentListError || paymentMethodChannelListError,
    mutatePaymentList,
    mutatePaymentMethodChannelList,
    mutate,
    deleteCache
  }
}

const ManualCode = "Manual"
const AddDialog = ({
  brandId,
  transferType,
  useFetch,
  onSubmitted,
  dialog,
  ...props
}) => {
  let {
    isLoading: isLoadingPayment,
    manualPayment,
    manualPaymentMethodList,
    manualPaymentMethodChannelList,
    error: loadingPaymentError
  } = usePlatformPayment()

  let title = useAddTrans()

  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } = useFetch(formData)

  if (isLoadingPayment) {
    return <LoadingBackdrop {...dialog} />
  }

  if (loadingPaymentError) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={{
        paymentCode: ManualCode,
        transferType,
        paymentStatus: BrandPaymentStatus.Enabled,
        paymentMethodId:
          manualPaymentMethodList?.length == 1
            ? head(manualPaymentMethodList)?.id
            : "",
        paymentMethodChannelId: "",
        playerListCondition: PlayerListCondition.MatchOne,
        allPlayers: true,
        depositedAmountMin: "0",
        extendedData: {}
      }}
      onSubmit={onSubmit}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      title={title}
      showCloseButton
      width="80vw"
      height="95vh"
      maxHeight="95vh"
      placement="top"
      display="flex"
      flexDirection="column"
      css={css`
        & .bb-Flex.bb-DialogContent {
          max-height: 95vh;
          flex: 1 auto;
          padding-bottom: 0.5em;
        }

        & .bb-DialogContent > .bb-Box {
          display: flex;
          flex-direction: column;
        }
      `}
      dialog={dialog}
      {...props}
    >
      <EditBody
        brandId={brandId}
        isAdd={true}
        manualPayment={manualPayment}
        manualPaymentMethodList={manualPaymentMethodList}
        manualPaymentMethodChannelList={manualPaymentMethodChannelList}
      />
    </FormDialog>
  )
}

const EditBody = ({
  brandId,
  isAdd = false,
  record = {},
  manualPayment = {},
  manualPaymentMethodList = [],
  manualPaymentMethodChannelList = [],
  dialog,
  ...props
}) => {
  let { setValue, getValues, control } = useFormContext()
  let transferType = getValues("transferType")
  let isDeposit = isDepositPlatformPayment(transferType)

  const paymentCode = getValues("paymentCode")
  const TransferLimitToFieldName = "transferLimitTo"
  let transferLimitTo = useWatch({
    name: TransferLimitToFieldName,
    control
  })

  const TransferLimitFromFieldName = "transferLimitFrom"
  let transferLimitFrom = useWatch({
    name: TransferLimitFromFieldName,
    control
  })

  const PaymentChannelIdFieldName = "paymentChannelId"
  let paymentChannelId = useWatch({
    name: PaymentChannelIdFieldName,
    control
  })

  const PaymentMethodFieldName = "paymentMethodId"
  let paymentMethodId = useWatch({
    name: PaymentMethodFieldName,
    control
  })

  let paymentChannelListRange = paymentMethodId
    ? manualPaymentMethodChannelList.filter(
        ({ methodId }) => methodId == paymentMethodId
      )
    : manualPaymentMethodChannelList

  let manualPaymentProdiverChanneIdRange = paymentChannelListRange?.map?.(
    ({ channelId }) => channelId
  )

  const PaymentMethodChannelIdFieldName = "paymentMethodChannelId"
  let paymentMethodChannelId = useWatch({
    name: PaymentMethodChannelIdFieldName,
    control
  })

  let isEdit = !isAdd
  let paymentId = isAdd ? manualPayment?.id : record?.paymentId

  let paymentMethod = manualPaymentMethodList?.find(
    ({ id }) => id == paymentMethodId
  )

  let manualPaymentMethodIdList = manualPaymentMethodList?.map(({ id }) => id)

  let isManualPaymentProvider = paymentCode == ManualCode
  let isManualPaymentProviderMethod =
    isManualPaymentProvider &&
    manualPaymentMethodIdList?.includes(paymentMethodId)
  useEffect(() => {
    if (isManualPaymentProvider && isManualPaymentProviderMethod) {
      let paymentMethodChannel = manualPaymentMethodChannelList.find((item) => {
        return (
          item.paymentId === paymentId &&
          item.methodId === paymentMethodId &&
          item.channelId === paymentChannelId
        )
      })
      setValue(PaymentMethodChannelIdFieldName, paymentMethodChannel?.id ?? "")
    }
  }, [isManualPaymentProvider, paymentChannelId, paymentMethodId])
  return (
    <Stack
      orientation="vertical"
      display="flex"
      flexDirection="column"
      flex="1 auto"
    >
      <Columns flex="1 auto" marginBottom="major-1">
        <Columns.Column>
          <Stack
            spacing="major-1"
            display="flex"
            flexDirection="column"
            height="100%"
          >
            <Heading use="h5">
              <Trans zh="基本资料" en="Basic" />
            </Heading>
            <FieldValues>
              <Label>
                <PaymentProviderTrans />
              </Label>
              <Box alignY="center">
                <Input type="hidden" name="paymentId" value={paymentId} />
                <PaymentProviderLabel value={paymentId} />
              </Box>

              <Label>
                <PaymentMethodTrans />
              </Label>
              <Box alignY="center">
                {isAdd && (
                  <PaymentMethodSelect
                    name={PaymentMethodFieldName}
                    range={manualPaymentMethodIdList}
                    required
                  />
                )}
                {isEdit && isManualPaymentProviderMethod && (
                  <PaymentMethodSelect
                    name={PaymentMethodFieldName}
                    range={manualPaymentMethodIdList}
                    required
                  />
                )}
                {isEdit && !isManualPaymentProviderMethod && (
                  <PaymentMethodLabel
                    range={manualPaymentMethodIdList}
                    value={record?.paymentMethodId}
                  />
                )}
                <Input
                  type="hidden"
                  name={PaymentMethodChannelIdFieldName}
                  value={paymentMethodChannelId}
                />
              </Box>

              <Label>
                <PaymentChannelTrans />
              </Label>
              <Box alignY="center">
                {isAdd && (
                  <PaymentChannelSelect
                    name={PaymentChannelIdFieldName}
                    range={manualPaymentProdiverChanneIdRange}
                    required
                  />
                )}
                {isEdit && isManualPaymentProviderMethod && (
                  <PaymentChannelSelect
                    name={PaymentChannelIdFieldName}
                    range={manualPaymentProdiverChanneIdRange}
                    required
                  />
                )}
                {isEdit && !isManualPaymentProviderMethod && (
                  <PaymentChannelLabel value={record?.paymentChannelId} />
                )}
              </Box>

              <Label required>
                <ChannelNameTrans />
              </Label>
              <Input name="channelName" size="small" required />

              <PaymentMethodSetting
                brandId={brandId}
                paymentCode={paymentCode}
                paymentMethodCode={paymentMethod?.code}
              />

              <Label>
                <StatusTrans />
              </Label>
              <Box>
                <BrandPaymentStatusButton name="paymentStatus" />
              </Box>

              <Label required>
                <PaymentLimitTrans />
              </Label>
              <NumberRangeInputGroup
                names={["transferLimitFrom", "transferLimitTo"]}
                required
                min={[0, transferLimitFrom]}
                max={[transferLimitTo]}
                width="100%"
              />

              {isDeposit && (
                <>
                  <Label>
                    <TransferFeeTrans />
                  </Label>
                  <Set orientation="horizontal">
                    <PercentageNumberInputField
                      name="handlingFeeRatePercentile"
                      defaultValue={0}
                      min={0}
                    />
                    <PlayerShallBearTransferFeeSwitch />
                  </Set>
                </>
              )}
            </FieldValues>

            <Columns flex="1 auto">
              <UploadListColumn
                name="whitelist"
                title={<Trans zh="白名单列表" en="Whitelist" />}
                list={record.whitelist}
                fileName="whitelist.xlsx"
              />
              <UploadListColumn
                name="blacklist"
                title={<Trans zh="黑名单列表" en="Blacklist" />}
                list={record.blacklist}
                fileName="blacklist.xlsx"
              />
            </Columns>
          </Stack>
        </Columns.Column>
        <Columns.Column>
          <Heading use="h5">
            <DisplayConditionTrans />
          </Heading>
          <FieldValues>
            <Label name="playerListCondition">
              <Trans zh="符合条件" en="Eligible" />
            </Label>
            <Box alignY="center">
              <PlayerListConditionRadioGroup
                name="playerListCondition"
                required
              />
            </Box>

            <Label name="allPlayers">
              <AllPlayerText />
            </Label>
            <Box alignY="center">
              <Switch name="allPlayers" width="auto" />
            </Box>

            <Label required>
              <AccumulatedDepositText />
            </Label>
            <Box alignY="center">
              <AccumulatedDepositGroup />
            </Box>

            <Label>
              <IdentityAuthenticationText />
            </Label>
            <Box alignY="center">
              <Switch name="identityAuthentication" />
            </Box>
          </FieldValues>
        </Columns.Column>
      </Columns>
      <Stack spacing="major-1" orientation="horizontal">
        <Box flex="0 auto">
          <Trans zh="变更原因" en="Reason" />
        </Box>

        <Textarea name="reason" />
      </Stack>
      <Input type="hidden" name="brandId" value={brandId} />
    </Stack>
  )
}

//TODO: test update value
const PlayerShallBearTransferFeeSwitch = ({
  name = "reducePlayerAmount",
  ...props
}) => {
  let label = useTrans({
    zh: "玩家承担手续费",
    en: "Player shall bear the transfer fee"
  })
  return <Switch name={name} label={label} {...props} />
}

const AccumulatedDepositGroup = () => {
  let { watch, setValue } = useFormContext()
  let DepositedAmountMinField = "depositedAmountMin"
  let depositedAmountMin = watch(DepositedAmountMinField)

  let DepositedAmountMaxField = "depositedAmountMax"
  let depositedAmountMax = watch(DepositedAmountMaxField)
  let disabledDepositedAmountMax = watch("depositedAmountUnlimited")

  useEffect(() => {
    if (disabledDepositedAmountMax) {
      //reset disabledDepositedAmountMax
      setValue(DepositedAmountMaxField, "")
    }
  }, [disabledDepositedAmountMax])

  return (
    <Stack orientation="horizontal" alignY="center">
      <NumberRangeInputGroup
        names={["depositedAmountMin", "depositedAmountMax"]}
        required
        min={[0, depositedAmountMin]}
        max={disabledDepositedAmountMax ? undefined : [depositedAmountMax]}
        disabled={[false, disabledDepositedAmountMax]}
        width="100%"
      />
      <CheckboxField
        name="depositedAmountUnlimited"
        checkboxLabel={<UnlimitedText />}
        whiteSpace="nowrap"
      />
    </Stack>
  )
}

const List = applyTheme(_List, {
  styles: {
    base: {
      border: "default"
    }
  }
})

const UploadListColumn = ({ name = "", title, fileName = "", list = null }) => {
  let { control, setValue, watch } = useFormContext()
  let currList = watch(name) ?? list ?? []

  let uploadFileInputRef = useRef()
  let [formData, setFormData] = useState()
  let { result, isLoading, error, deleteCache } =
    useBrandPaymentUpload(formData)

  const resetFormData = () => {
    if (uploadFileInputRef?.current) {
      uploadFileInputRef.current.value = ""
    }
    deleteCache()
    setFormData(undefined)
  }

  useEffect(() => {
    if (Array.isArray(result?.players) && !error) {
      setValue(name, result?.players)
    }
  }, [formData, result])

  return (
    <Controller
      control={control}
      name={name}
      shouldUnregister={true}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { isTouched, isDirty, error }
      }) => (
        <Columns.Column display="flex" flexDirection="column">
          {error && <AlertDialog {...error} onClickClose={resetFormData} />}
          <Stack orientation="horizontal" alignY="center" spacing="major-1">
            <Text.Block>{title}</Text.Block>
            <Button
              use="a"
              href="/download/payments/list.xlsx"
              download={fileName}
              palette="primary"
              size="small"
            >
              <Trans zh="格式" en="Format" />
            </Button>
          </Stack>
          <List overflowY="scroll" flex="1 0 5em" marginY="minor-1">
            {currList.map((item) => (
              <List.Item key={item}>{item}</List.Item>
            ))}
          </List>
          <Set alignX="center" orientation="horizontal">
            <input
              ref={uploadFileInputRef}
              type="file"
              onChange={(event) => {
                let [file] = event.target.files
                if (file) {
                  let formData = new FormData()
                  formData.append("file", file, file.name)
                  setFormData(formData)
                } else {
                  resetFormData()
                }
              }}
              css={css`
                display: none;
              `}
            />
            <Button
              palette="primary"
              type="button"
              onClick={(event) => {
                uploadFileInputRef?.current.click()
              }}
              size="small"
              isLoading={isLoading}
              disabled={isLoading}
            >
              <Trans zh="上传" en="Upload" />
            </Button>
            <Button
              type="button"
              size="small"
              onClick={() => {
                console.log("name what: ")
                console.log(name)
                setValue(name, [])
              }}
            >
              <Trans zh="清除" en="Clear" />
            </Button>
          </Set>
        </Columns.Column>
      )}
    />
  )
}
