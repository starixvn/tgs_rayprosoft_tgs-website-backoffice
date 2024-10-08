import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Stack,
  Flex,
  Box,
  Card,
  Set,
  Button,
  Text,
  Label,
  Dialog,
  Modal,
  useClassName,
  Icon,
  Tooltip
} from "bumbag"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { Copy as CopyMenu } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import { useCopyRole } from "./client"
import { Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import Input from "../../input/Input"
import { WrapperModal } from "../../styles/wrapper"
import { faCopy } from "@fortawesome/free-solid-svg-icons"

export const CopyButton = ({ id, name, onSubmitted, disabled, ...props }) => {
  let dialog = Modal.useState()

  let isDisplay = useIsDisplayMenuByRoute([CopyMenu])
  if (!isDisplay) {
    return null
  }

  let dialogId = `copy-role-dialog`
  let disclosureId = `${dialogId}-disclosure`

  return (
    <>
      <div
        css={css`
          cursor: ${disabled ? "not-allowed" : "pointer"} !important;
        `}
      >
        <Tooltip
          content={<Trans zh="复制" en="Copy" />}
          hasArrow
          placement="bottom"
        >
          <Disclosure
            id={disclosureId}
            // disabled={disabled}
            {...dialog}
            palette="secondary"
            css={css`
              opacity: ${disabled ? "0.7" : "1"} !important;
              pointer-events: ${disabled ? "none" : "unset"} !important;
            `}
          >
            {/* <Trans zh="复制" en="Copy" /> */}
            <Icon
              icon={faCopy}
              type="font-awesome"
              color="#080a0c"
              fontSize="16px"
              fontWeight="400"
            />
          </Disclosure>
        </Tooltip>
      </div>
      {dialog.visible && (
        <CopyDialog
          id={id}
          name={name}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const CopyDialog = ({
  id,
  name = "",
  onSubmitted,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useTrans({
    zh: "复制权限组",
    en: "Copy Role"
  })

  let [submitData, setSubmit] = useState()
  let { result, error, isLoading, deleteCache } = useCopyRole(id, submitData)

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={{
        name
      }}
      onSubmit={setSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      title={title}
      dialog={dialog}
      id={dialogId}
    >
      <WrapperModal>
        <Input name="name" required />
      </WrapperModal>
    </FormDialog>
  )
}
