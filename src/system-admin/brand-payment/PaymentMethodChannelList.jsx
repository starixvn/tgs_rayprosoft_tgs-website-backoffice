import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  Group,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog,
  Card,
  FieldWrapper,
  Columns,
  DropdownMenu
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import {
  Disclosure,
  DeleteDisclosure,
  AddDisclosure
} from "../../dialog/Disclosure"
import {
  useAddPaymentMethodChannel,
  useDeletePaymentMethodChannel,
  usePaymentMethodChannelList
} from "../../payment/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import {
  PaymentProviderLabel,
  PaymentProviderSelect
} from "../../payment/PaymentProvider"
import {
  PaymentMethodLabel,
  PaymentMethodSelect
} from "../../payment/method/PaymentMethod"
import {
  PaymentChannelLabel,
  PaymentChannelSelect
} from "../../payment/channel/PaymentChannel"
import { Trans, useTrans } from "../../i18n"
import { FormDialog } from "../../form/FormDialog"
import AlertDialog from "../../dialog/Alert"
import Backdrop from "../../dialog/Backdrop"
import { DeleteText } from "../../button/ActionButtons"
import { View, Update } from "./menu"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { ActionTrans } from "../../trans/Action"
import {
  PaymentChannelTrans,
  PaymentMethodTrans,
  PaymentProviderTrans
} from "../../trans/Payment"
import { WrapperModal } from "../../styles/wrapper"
import { ActionTableButton, SearchAndSubmitButton } from "../../styles/button"
import { cssCustomModalXs } from "../../styles/modal"
import { cssSelectFullWidth } from "../../system/brandpayments/style"

export const PaymentMethodChannelListDialog = ({ dialog, onSubmitted }) => {
  let { isLoading, data, error, mutate, deleteCache } =
    usePaymentMethodChannelList()

  let items = data?.allData
  let columns = useColumns({ items, mutate })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      title="Payment Method Channel List"
      showCloseButton
      {...dialog}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      hideOnClickOutside={false}
      minWidth="60vw"
      maxWidth="80vw"
      css={cssCustomModalXs}
    >
      <WrapperModal>
        <ActionBar mutate={mutate} />
        <Table columns={columns} data={items} />
      </WrapperModal>
    </Dialog.Modal>
  )
}

const ActionBar = ({ mutate }) => {
  return (
    <Box alignX="right" marginBottom="8px">
      <SearchAndSubmitButton>
        <AddPaymentMethodChannelDialogDisclosure onSubmitted={mutate} />
      </SearchAndSubmitButton>
    </Box>
  )
}

const AddPaymentMethodChannelDialogDisclosure = ({ onSubmitted }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} />
      {dialog.visible && (
        <AddPaymentMethodChannelDialog
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

export const AddPaymentMethodChannelDialog = ({ onSubmitted, dialog }) => {
  let title = useTrans({
    zh: "Add Payment Method Channel",
    en: "Add Payment Method Channel"
  })
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddPaymentMethodChannel(formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        onCloseErrorAlert={reset}
        title={title}
        dialog={dialog}
        width="40vw"
        css={cssCustomModalXs}
      >
        <FormBody />
      </FormDialog>
    </Backdrop>
  )
}

const FormBody = () => {
  return (
    <WrapperModal>
      <FieldStack orientation="horizontal" css={cssSelectFullWidth}>
        <FieldWrapper label="Payment Provider">
          <PaymentProviderSelect name="paymentId" required />
        </FieldWrapper>
        <FieldWrapper label="Payment Method">
          <PaymentMethodSelect name="methodId" required />
        </FieldWrapper>
        <FieldWrapper label="Payment Channel">
          <PaymentChannelSelect name="channelId" required />
        </FieldWrapper>
      </FieldStack>
    </WrapperModal>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "paymentId",
        Header: <PaymentProviderTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentProviderLabel value={value} />
      }),
      textColumn({
        accessor: "methodId",
        Header: <PaymentMethodTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentMethodLabel value={value} />
      }),
      textColumn({
        accessor: "channelId",
        Header: <PaymentChannelTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentChannelLabel value={value} />
      })
    ]

    if (hasUpdateAuth) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          Header: <ActionTrans />,
          disableSortBy: true,
          Cell: ({ value }) => (
            <ActionTableButton>
              <DeleteDialogDisclosure record={value} onSubmitted={mutate} />
            </ActionTableButton>
          )
        })
      )
    }

    return columns
  }, [JSON.stringify(items)])
}

const DeleteDialogDisclosure = ({ record, onSubmitted }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <DeleteDisclosure {...dialog} />
      {dialog.visible && (
        <DeleteDialog
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const DeleteDialog = ({ record, onSubmitted, dialog }) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useDeletePaymentMethodChannel(formData)

  const onSubmit = (data) => setSubmit(record.id)

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        onCloseErrorAlert={reset}
        type="danger"
        title="Confirm Delete?"
        submitText={<DeleteText />}
        dialog={dialog}
        hideBackdrop
        minWidth="30vw"
        actionButtonsProps={{
          submitProps: {
            palette: "danger",
            variant: "outlined"
          }
        }}
        css={css`
          .bb-DialogIconWrapper {
            margin-right: 0 !important;
          }
        `}
      >
        <WrapperModal>
          <FieldStack orientation="horizontal">
            <FieldWrapper label="Payment">
              <PaymentProviderLabel value={record.paymentId} />
            </FieldWrapper>

            <FieldWrapper label="Method">
              <PaymentMethodLabel value={record.methodId} />
            </FieldWrapper>

            <FieldWrapper label="Channel">
              <PaymentChannelLabel value={record.channelId} />
            </FieldWrapper>
          </FieldStack>
        </WrapperModal>
      </FormDialog>
    </Backdrop>
  )
}
