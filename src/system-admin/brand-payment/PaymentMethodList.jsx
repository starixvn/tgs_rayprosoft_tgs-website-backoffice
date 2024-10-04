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
import { cssCustomModalXs } from "../../styles/modal"
import { WrapperModal } from "../../styles/wrapper"
import { CustomTableStyle } from "../../styles/tablle"
import { SearchAndSubmitButton } from "../../styles/button"

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
        <AddPaymentMethodDisclosure onSubmitted={onSubmitted} />
      </SearchAndSubmitButton>
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
