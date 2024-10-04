import { Button, DropdownMenu, Level, Set, useModalState } from "bumbag"
import React, { useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { SearchButton } from "../../button/SearchButton"
import AlertDialog from "../../dialog/Alert"
import { Trans } from "../../i18n"
import { InputField } from "../../input/Input"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import PageContent from "../../page/Content"
import { PaymentProviderLabel } from "../../payment/PaymentProvider"
import { PaymentChannelLabel } from "../../payment/channel/PaymentChannel"
import { PaymentMethodLabel } from "../../payment/method/PaymentMethod"
import {
  BrandPaymentStatusLabel,
  BrandPaymentStatusSelect,
  BrandPaymentStatusToggleButton
} from "../../system/brandpayments/BrandPaymentStatus"
import { BrandPaymentTransferTypeSelect } from "../../system/brandpayments/BrandPaymentTransferType"
import { useBrandPaymentList } from "../../system/brandpayments/client"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import textColumn from "../../table/column/textColumn"
import { SortOrder } from "../../table/order"
import { ActionTrans } from "../../trans/Action"
import {
  ChannelNameTrans,
  PaymentChannelTrans,
  PaymentMethodTrans,
  PaymentProviderTrans
} from "../../trans/Payment"
import { StatusTrans } from "../../trans/Status"
import { useIsDisplayMenuByRoute } from "../../user/context"
import {
  AddBrandPaymentDisclosure,
  EditBrandPaymentDisclosure
} from "./BrandPayment"
import { PaymentChannelListDialog } from "./PaymentChannelList"
import { PaymentListDialog } from "./PaymentList"
import { PaymentMethodChannelListDialog } from "./PaymentMethodChannelList"
import { PaymentMethodListDialog } from "./PaymentMethodList"
import { Code, Update, View } from "./menu"
import { CustomTableStyle } from "../../styles/tablle"
import { CustomInputSearch } from "../../styles/input"
import { ActionTableButton } from "../../styles/button"
import { cssNowrap, cssPositionDropdownPayment } from "./style"
import { css } from "@emotion/react"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let { state, setState, setPageIndex, setSortOrder, setPageSize } = useTable({
    brandId: "",
    transferType: "",
    keyword: ""
  })

  let { isLoading, data, error, mutate, emptyData } = useBrandPaymentList({
    ...toApiParams(state),
    sortby: "createdOn",
    orderby: SortOrder.Descending
  })

  let items = data?.items
  let columns = useColumns({ items, mutate })

  return (
    <PageContent
      title={<Trans zh="平台支付管理" en="Platform Payment Management" />}
      actionBar={
        <Level
          css={css`
            position: relative;
          `}
        >
          <SearchBar
            search={(newState) => {
              setState({ pageIndex: 0, ...newState })
              mutate()
            }}
            isLoading={isLoading}
          />
          <Set orientation="horizontal" css={cssPositionDropdownPayment}>
            <PaymentListDropdownMenu onSubmitted={mutate} />
            <AddBrandPaymentDisclosure
              brandId={state.brandId}
              onSubmitted={mutate}
            />
          </Set>
        </Level>
      }
    >
      <CustomTableStyle>
        <Table
          columns={columns}
          data={items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
          setPageSize={setPageSize}
        />
      </CustomTableStyle>
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </PageContent>
  )
}

const PaymentListDropdownMenu = ({ onSubmitted }) => {
  let paymentListDialog = useModalState()
  let paymentMethodListDialog = useModalState()
  let paymentChannelListDialog = useModalState()
  let paymentMethodChannelListDialogdialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <DropdownMenu
        menu={
          <>
            <DropdownMenu.Item onClick={paymentListDialog.show}>
              <Trans zh="支付厂商" en="Payment Providers" />
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={paymentMethodListDialog.show}>
              <PaymentMethodTrans />
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={paymentChannelListDialog.show}>
              <PaymentChannelTrans />
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={paymentMethodChannelListDialogdialog.show}
            >
              <Trans zh="Payment Method Channel" en="Payment Method Channel" />
            </DropdownMenu.Item>
          </>
        }
      >
        <Button iconAfter="chevron-down">
          <Trans zh="支付列表" en="Payment  List" />
        </Button>
      </DropdownMenu>
      {paymentListDialog.visible && (
        <PaymentListDialog
          dialog={paymentListDialog}
          onSubmitted={onSubmitted}
        />
      )}
      {paymentMethodListDialog.visible && (
        <PaymentMethodListDialog
          dialog={paymentMethodListDialog}
          onSubmitted={onSubmitted}
        />
      )}
      {paymentChannelListDialog.visible && (
        <PaymentChannelListDialog
          dialog={paymentChannelListDialog}
          onSubmitted={onSubmitted}
        />
      )}
      {paymentMethodChannelListDialogdialog.visible && (
        <PaymentMethodChannelListDialog
          dialog={paymentMethodChannelListDialogdialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const SearchBar = ({ search, isLoading, ...props }) => {
  let formMethods = useForm()
  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set css={cssNowrap}>
          <MerchantIdSelect required={false} />
          <BrandPaymentTransferTypeSelect name="transferType" />
          <BrandPaymentStatusSelect name="paymentStatus" />
          <CustomInputSearch>
            <InputField
              name="keyword"
              showEmptyFieldValueAddonAfter
              placeholder="Keyword"
            />
          </CustomInputSearch>
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "transferType",
        Header: <Trans zh="Transfer Type" en="Transfer Type" />,
        disableSortBy: true,
        Cell: ({ value }) => value
      }),
      textColumn({
        accessor: "paymentId",
        Header: <PaymentProviderTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentProviderLabel value={value} showCode />
      }),
      textColumn({
        accessor: "paymentMethodId",
        Header: <PaymentMethodTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentMethodLabel value={value} showCode />
      }),
      textColumn({
        accessor: "paymentChannelId",
        Header: <PaymentChannelTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentChannelLabel value={value} showCode />
      }),
      textColumn({
        accessor: "channelName",
        Header: <ChannelNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        id: "paymentStatus",
        accessor: (record) => record,
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          if (!hasUpdateAuth) {
            return <BrandPaymentStatusLabel value={value.paymentStatus} />
          }

          return (
            <BrandPaymentStatusToggleButton
              record={value}
              onSubmitted={mutate}
            />
          )
        }
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <ActionTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <ActionTableButton>
              <EditBrandPaymentDisclosure
                record={value}
                platformPaymentId={value?.id}
                onSubmitted={mutate}
              />
            </ActionTableButton>
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
