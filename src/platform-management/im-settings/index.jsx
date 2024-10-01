import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Set, Spinner, useModalState, Box } from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { MessengerDialogDisclosure } from "./MessengerDialog"
import { CreateOrEditLiveChatDialogDisclosure } from "./LiveChatDialog"
import { isDev } from "../../env"
import { AgentMultipleLayerProfitSharingSettingFormBody } from "../../agent/AgentMultipleLayerProfitSharingSetting"
import Disclosure from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import {
  usePlatformAgentDividendCondition,
  useUpdatePlatformAgentDividendCondition
} from "./client"
import { useBrand } from "../../merchant/platforms/client"
import { isAgentProfitSharingMultipleLayer } from "../../agent/AgentProfitSharingType"
import { Update } from "./menu"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { AllAgentDialogDisclosure } from "./AllAgentDialog"
import { OperationSettingsTrans } from "../../trans/Platform"
import { SmsProviderDialogDisclosure } from "./SmsProviderDialog"
import { SocialMediaListDialogDisclosure } from "./SocialMediaListDialog"
import { SWRConfig } from "swr"
import { WrapperBg, WrapperModal } from "../../styles/wrapper"
import { SearchAndSubmitButton } from "../../styles/button"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<OperationSettingsTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

const Body = () => {
  let brandId = usePlatformId()
  let { isLoading, data: brand, error, mutate, emptyData } = useBrand(brandId)

  return (
    <Set orientation="vertical" isFilled height="100%">
      <WrapperBg>
        {isLoading && (
          <Box alignY="center" alignX="center">
            <Spinner />
          </Box>
        )}
        {!isLoading && brandId && brand && (
          <BodyContent brandId={brandId} brand={brand} />
        )}
        {error && <AlertDialog {...error} onClickClose={emptyData} />}
      </WrapperBg>
    </Set>
  )
}

const BodyContent = ({ brandId, brand }) => {
  let agentProfitSharingType = brand?.agentDividendType
  let multipleLayer = isAgentProfitSharingMultipleLayer(agentProfitSharingType)

  return (
    <SearchAndSubmitButton
      css={css`
        display: flex;
        gap: 8px;
      `}
    >
      <MessengerDialogDisclosure
        id="instant-messaging-dialog-disclosure"
        brandId={brandId}
      />
      <CreateOrEditLiveChatDialogDisclosure
        id="live-chat-dialog-disclosure"
        brandId={brandId}
      />
      {multipleLayer && (
        <PlatformProfitSharingSettingDialogDisclosure
          id="profit-sharing-setting-dialog-disclosure"
          brandId={brandId}
        />
      )}

      <AllAgentDialogDisclosure
        id="all-agent-setting-dialog-disclosure"
        brandId={brandId}
      />
      <SmsProviderDialogDisclosure brandId={brandId} />
      <SocialMediaListDialogDisclosure brandId={brandId} />
    </SearchAndSubmitButton>
  )
}

const PlatformProfitSharingSettingDialogDisclosure = ({
  brandId,
  name = "brandAgentDividendConditions",
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="阶梯式分红设定" en="Tier-based Profit Sharing Setting" />
      </Disclosure>
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <PlatformMultipleLayerProfitSharingSettingDialog
            brandId={brandId}
            dialog={dialog}
          />
        </SWRConfig>
      )}
    </>
  )
}

const PlatformMultipleLayerProfitSharingSettingDialog = ({
  brandId,
  dialog,
  ...props
}) => {
  let { isLoading, data, error, mutate } =
    usePlatformAgentDividendCondition(brandId)
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <ProfitSharingSettingFormDialog
      brandId={brandId}
      record={data?.items}
      onSubmitted={() => {
        mutate(undefined, false)
      }}
      dialog={dialog}
      {...props}
    />
  )
}

const ProfitSharingSettingFormDialog = ({
  brandId,
  record = [],
  dialog,
  onSubmitted,
  ...props
}) => {
  let title = useTrans({
    zh: "阶梯式分红设定",
    en: "Profit Sharing Setting"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformAgentDividendCondition(formData)

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  const onSubmit = (formData) => {
    setSubmit(formData)
  }

  return (
    <FormDialog
      id="profit-sharing-setting-dialog"
      defaultValues={{
        brandId,
        brandAgentDividendConditions: clone(record)
      }}
      onSubmit={onSubmit}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      {...props}
      minWidth="45vw"
    >
      <WrapperModal>
        <AgentMultipleLayerProfitSharingSettingFormBody name="brandAgentDividendConditions" />
      </WrapperModal>
    </FormDialog>
  )
}
