import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Button,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure, DeleteDisclosure } from "../../dialog/Disclosure"
import { usePaymentList } from "../../payment/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import Backdrop from "../../dialog/Backdrop"
import { DeleteText } from "../../button/ActionButtons"
import { View, Update } from "./menu"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import dateTimeColumn from "../../table/column/dateTime"
import { AddPaymentDisclosure, EditPaymentDisclosure } from "./Payment"
import { cssCustomModalXs } from "../../styles/modal"
import { WrapperModal } from "../../styles/wrapper"
import { CustomTableStyle } from "../../styles/tablle"
import { SearchAndSubmitButton } from "../../styles/button"

export const PaymentListDialog = ({ dialog, onSubmitted }) => {
  let title = useTrans({
    zh: "支付厂商列表",
    en: "Payment Provider List"
  })
  let { isLoading, data, error, mutate, deleteCache } = usePaymentList()

  let items = data ?? []
  let columns = useColumns({ items, mutate })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      title={title}
      showCloseButton
      {...dialog}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      hideOnClickOutside={false}
      minWidth="60vw"
      maxWidth="80vw"
      css={cssCustomModalXs}
    >
      <WrapperModal>
        <ActionBar onSubmitted={mutate} />
        <CustomTableStyle>
          <Table columns={columns} data={items} />
        </CustomTableStyle>
      </WrapperModal>
    </Dialog.Modal>
  )
}

const ActionBar = ({ onSubmitted }) => {
  return (
    <Box alignX="right" marginBottom="8px">
      <SearchAndSubmitButton>
        <AddPaymentDisclosure onSubmitted={onSubmitted} />
      </SearchAndSubmitButton>
    </Box>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "code",
        Header: <Trans zh="支付厂商代码" en="Payment Provider Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="支付厂商名称" en="Payment Provider Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "description",
        Header: <Trans zh="简介" en="Description" />,
        disableSortBy: true
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
