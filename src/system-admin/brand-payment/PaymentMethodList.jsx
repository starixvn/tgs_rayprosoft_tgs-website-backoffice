import { Box, Dialog, FieldStack } from "bumbag"
import React, { useMemo } from "react"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { Trans, useTrans } from "../../i18n"
import { usePaymentMethodList } from "../../payment/client"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { PaymentMethodCodeTrans } from "../../trans/Payment"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import { AddPaymentMethodDisclosure } from "./PaymentMethod"

export const PaymentMethodListDialog = ({ dialog, onSubmitted }) => {
  let title = useTrans({
    zh: "支付方式列表",
    en: "Payment Method List"
  })

  let { isLoading, data, error, mutate, deleteCache } = usePaymentMethodList()

  let items = data
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
    >
      <FieldStack>
        <ActionBar onSubmitted={mutate} />
        <Table columns={columns} data={items} />
      </FieldStack>
    </Dialog.Modal>
  )
}

const ActionBar = ({ onSubmitted }) => {
  return (
    <Box alignX="right">
      <AddPaymentMethodDisclosure onSubmitted={onSubmitted} />
    </Box>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "id",
        Header: <Trans zh="ID" en="ID" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "code",
        Header: <PaymentMethodCodeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "bankType",
        Header: <Trans zh="Bank Type" en="Bank Type" />,
        disableSortBy: true
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
