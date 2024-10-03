import { css } from "@emotion/react"
import { Blockquote, Box, FieldStack, Heading, Level, Set } from "bumbag"
import clone from "clone-deep"
import { isAfter, isSameDay, isValid, max, parseISO, subDays } from "date-fns"
import equals from "fast-deep-equal"
import React, { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useLocation } from "react-router-dom"
import DownloadButton from "../../button/DownloadButton"
import SearchButton from "../../button/SearchButton"
import { urlWith } from "../../client"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { today } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import AlertDialog from "../../dialog/Alert"
import { FormattedNumberDecimal, useLangCode, useTrans } from "../../i18n"
import { InputField } from "../../input/Input"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import {
  PlatformPaymentProviderSelect,
  PlatformPaymentTransferType
} from "../../payment/PlatformPaymentProviderSelect"
import { BrandPaymentMultiSelect } from "../../system/brandpayments/BrandPaymentMultiSelect"
import BrandPaymentTransferType from "../../system/brandpayments/BrandPaymentTransferType"
import { useBrandPaymentList } from "../../system/brandpayments/client"
import { Table, pageCount, toApiParams, useTable } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import sequenceColumn from "../../table/column/sequence"
import { noWrapTextColumn } from "../../table/column/textColumn"
import { SortOrder } from "../../table/order"
import { ActionTrans, OperatorTrans, RemarkTrans } from "../../trans/Action"
import { ApplicationTimeTrans, UpdatedTimeTrans } from "../../trans/Date"
import { useTotalWithdrawAmountTrans } from "../../trans/Field"
import {
  ActualWithdrawAmountTrans,
  PaidTimeTrans,
  WithdrawAmountTrans,
  WithdrawListTrans,
  usePaymentProviderTrans
} from "../../trans/Payment"
import {
  GmsIdTrans,
  ThirdPartyIdTrans,
  useGmsIdTrans,
  useSystemIdTrans,
  useThirdPartyIdTrans
} from "../../trans/Platform"
import { StatusTrans } from "../../trans/Status"
import {
  UserNameTrans,
  UserTypeTrans,
  useUserNameTrans
} from "../../trans/User"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Code as ModuleCode } from "../menu"
import { API, useFundWithdrawFormList } from "./client"
import { FundWithdrawPaidDialogDisclosure } from "./FundWithdrawPaid"
import FundWithdrawStatus, {
  FundWithdrawStatusBox,
  FundWithdrawStatusSelect,
  isFundApproved,
  isFundInvalid,
  isFundPaid,
  isFundUnderReview
} from "./FundWithdrawStatus"
import { Code, Code as PageCode, Update } from "./menu"
import { RejectFundWithdrawDisclosure } from "./RejectFundWithdraw"
import { UserTypeLabel, UserTypeSelect } from "./UserType"
import { VerifyFundWithdrawDisclosure } from "./VerifyFundWithdraw"
import { ViewFundWithdrawDisclosure } from "./ViewFundWithdraw"
import { WrapperBg } from "../../styles/wrapper"
import { CustomTableStyle } from "../../styles/tablle"

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<WithdrawListTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const SecondInMilliseconds = 1000
const MinuteInMilliseconds = 60000

const Body = ({}) => {
  let brandId = usePlatformId()
  let location = useLocation()

  let todayRange = today()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    username: "",
    channelName: "",
    payment: "",
    status: location?.state?.status ?? FundWithdrawStatus.UnprocessedStatus,
    thirdOrderNo: "",
    orderNo: "",
    beginCreateOn: todayRange.start,
    endCreateOn: todayRange.end,
    beginUpdateOn: undefined,
    endUpdateOn: undefined,
    brandPaymentIds: undefined
  })

  useEffect(() => {
    setState({ pageIndex: 0 })
  }, [brandId])

  let {
    pageIndex,
    pageSize,
    username,
    channelName,
    status,
    beginCreateOn,
    endCreateOn,
    beginUpdateOn,
    endUpdateOn
  } = state

  let culture = useLangCode()

  const toSearchParams = () => ({
    ...toApiParams(state),
    bc: state.beginCreateOn,
    ec: startOfNextDay(state.endCreateOn),
    bu: state.beginUpdateOn,
    eu: startOfNextDay(state.endUpdateOn),
    /*
      Note. backend api use 'bpid' instead of 'brandPaymentIds'
     */
    brandPaymentIds: undefined,
    bpid: state.brandPaymentIds,
    sortby: "CreatedOn",
    orderby: SortOrder.Descending,
    culture
  })

  let {
    isLoading: isLoadingBrandPayment,
    data: brandPaymentList,
    error: brandPaymentListError
  } = useBrandPaymentList({
    brandId,
    transferType: BrandPaymentTransferType.Withdrawal,
    showAll: true
  })

  let manualBrandPaymentIdList = brandPaymentList?.items
    ?.filter?.(({ paymentName, ...rest }) => paymentName == "Manual")
    .map(({ id }) => id)

  let {
    data = {},
    isLoading,
    mutate: mutateFormList,
    error,
    emptyData
  } = useFundWithdrawFormList(brandId, toSearchParams(), {
    refreshInterval: 10 * SecondInMilliseconds
  })

  useEffect(() => {
    if (location?.state?.fromNotify) {
      todayRange = today()
      setState({
        pageIndex: 0,
        username: "",
        channelName: "",
        payment: "",
        status: location?.state?.status ?? "",
        thirdOrderNo: "",
        orderNo: "",
        id: "",
        beginCreateOn: todayRange.start,
        endCreateOn: todayRange.end,
        beginUpdateOn: undefined,
        endUpdateOn: undefined,
        brandPaymentIds: undefined
      })

      mutateFormList(undefined)
    }
  }, [location?.state?.fromNotify])

  let [items, setItems] = useState([])
  let [isUpdateAvailable, setUpdateAvailable] = useState(false)
  let [delayUpdate, setDelayUpdate] = useState(false)

  let [autoLoading, setAutoLoading] = useState(false)

  const showUpdates = () => {
    let newApplications = newApplicationsFromToday(data.items, items)
    if (newApplications.length) {
      // notifyAudio.play()
    }

    setAutoLoading(true)
    setItems(clone(data.items))
    setUpdateAvailable(false)

    setTimeout(() => {
      setAutoLoading(false)
    }, 0.5 * SecondInMilliseconds)
  }

  useEffect(() => {
    if (!delayUpdate && isUpdateAvailable) {
      showUpdates()
    }
  }, [delayUpdate, isUpdateAvailable])

  const mutate = () => {
    mutateFormList()
    setDelayUpdate(false)
  }

  useEffect(() => {
    let hasUpdate = data?.items && !equals(items, data?.items)
    setUpdateAvailable(hasUpdate)

    if (hasUpdate && !delayUpdate) {
      showUpdates()
    }
  }, [JSON.stringify(data?.items)])

  let QueryMaxRangeDays = 31
  let DataRetentionDays = 90
  let minDate = subDays(todayRange.start, DataRetentionDays)

  let columns = useColumns({
    mutate,
    items,
    brandId,
    setDelayUpdate,
    manualBrandPaymentIdList
  })

  return (
    <Set
      orientation="vertical"
      isFilled
      height="100%"
      css={css`
        .bb-PopoverDisclosure {
          position: absolute;
          right: 8px;
          top: 8px;
          &:focus,
          &:hover,
          &:active {
            box-shadow: none !important;
            border: 1px solid #d9d9e1;
          }
        }
      `}
    >
      <WrapperBg>
        <Level
          alignY="bottom"
          alignX="left"
          verticalBelow="mobile"
          marginBottom="8px"
        >
          <SearchBar
            brandId={brandId}
            username={username}
            channelName={channelName}
            payment={state.payment}
            status={status}
            thirdOrderNo={state.thirdOrderNo}
            orderNo={state.orderNo}
            id={state.id}
            beginCreateOn={beginCreateOn}
            endCreateOn={endCreateOn}
            beginUpdateOn={beginUpdateOn}
            endUpdateOn={endUpdateOn}
            brandPaymentIds={state.brandPaymentIds}
            minDate={minDate}
            maxRangeDays={QueryMaxRangeDays}
            search={(data = {}) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading || autoLoading}
          />
          {data?.items?.length > 0 && (
            <Box>
              <DownloadButton
                id="export-report"
                isLoading={isLoading}
                href={urlWith(
                  toSearchParams(),
                  `${API}/exportWithdraw/${brandId}`
                )}
                download="Withdraw.xlsx"
              />
            </Box>
          )}
        </Level>
        <CustomTableStyle>
          <Table
            id="withdraw"
            columns={columns}
            data={items}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading || autoLoading}
            getRowId={(row) => row.id}
            localStorageKey={TableLocalStorageKey}
            toggleColumnHidden={true}
            menubar={Level}
            menuAddonBefore={<Summary key="summary" total={data?.sum} />}
          />
        </CustomTableStyle>

        {error && <AlertDialog {...error} onClickClose={emptyData} />}
      </WrapperBg>
    </Set>
  )
}

const Summary = ({ total }) => {
  let totalWithdrawAmountLabel = useTotalWithdrawAmountTrans()
  if (!Number.isFinite(total)) {
    return null
  }

  return (
    <Blockquote borderColor="primary" background="#fff" width="100%">
      <Heading use="h5">
        {`${totalWithdrawAmountLabel}：`}
        <FormattedNumberDecimal id="total-amount" value={total} />
      </Heading>
    </Blockquote>
  )
}

const newApplicationsFromToday = (first = [], second = []) => {
  if (!second || second.length === 0) {
    return []
  }

  let today = new Date()
  let lastMaxApplicationTime = max(
    second.reduce((times, { createdOn }) => {
      let value = parseISO(createdOn)
      if (isValid(value)) {
        times.push(value)
      }

      return times
    }, [])
  )

  const findSameById = (id, list = []) => list.find((item) => item.id === id)

  let result = first.filter(({ createdOn, id }) => {
    createdOn = parseISO(createdOn)
    return (
      isSameDay(today, createdOn) &&
      isAfter(createdOn, lastMaxApplicationTime) &&
      !findSameById(id, second)
    )
  })

  return result
}

const SearchBar = ({
  brandId,
  username,
  channelName,
  payment,
  status,
  thirdOrderNo,
  orderNo,
  id,
  beginCreateOn,
  endCreateOn,
  beginUpdateOn,
  endUpdateOn,
  brandPaymentIds,
  minDate,
  maxRangeDays,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      username,
      channelName,
      payment,
      status,
      thirdOrderNo,
      orderNo,
      id,
      beginCreateOn,
      endCreateOn,
      beginUpdateOn,
      endUpdateOn,
      brandPaymentIds
    }
  })

  useEffect(() => {
    formMethods.reset({
      username,
      channelName,
      payment,
      status,
      thirdOrderNo,
      orderNo,
      id,
      beginCreateOn,
      endCreateOn,
      beginUpdateOn,
      endUpdateOn,
      brandPaymentIds
    })
  }, [
    username,
    channelName,
    payment,
    status,
    thirdOrderNo,
    orderNo,
    id,
    beginCreateOn,
    endCreateOn,
    beginUpdateOn,
    endUpdateOn,
    brandPaymentIds
  ])

  let usernameInputPlaceholder = useUserNameTrans()

  let platformPaymentPlaceholder = useTrans({
    zh: "提款通道",
    en: "Withdrawal Channel"
  })

  let paymentProviderPlaceholder = usePaymentProviderTrans()
  let externalIdPlaceholder = useThirdPartyIdTrans()
  let orderIdPlaceholder = useGmsIdTrans()
  let idPlaceholder = useSystemIdTrans()
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <FieldStack orientation="vertical" spacing="minor-2">
          <Set orientation="horizontal">
            <InputField
              name="username"
              showEmptyFieldValueAddonAfter
              placeholder={usernameInputPlaceholder}
            />
            <UserTypeSelect
              name="userType"
              css={css`
                min-width: 251px;
              `}
            />
            <PlatformPaymentProviderSelect
              name="payment"
              brandId={brandId}
              transferType={PlatformPaymentTransferType.Withdrawal}
              placeholder={paymentProviderPlaceholder}
              css={css`
                min-width: 251px;
              `}
            />
            <FundWithdrawStatusSelect
              id="status-select"
              name="status"
              css={css`
                min-width: 251px;
              `}
            />
            <BrandPaymentMultiSelect
              name="brandPaymentIds"
              brandId={brandId}
              transferType={PlatformPaymentTransferType.Withdrawal}
              placeholder={platformPaymentPlaceholder}
            />
            <InputField
              name="thirdOrderNo"
              placeholder={externalIdPlaceholder}
              showEmptyFieldValueAddonAfter
            />
            <InputField
              name="orderNo"
              placeholder={orderIdPlaceholder}
              showEmptyFieldValueAddonAfter
            />
            <InputField
              name="id"
              placeholder={idPlaceholder}
              showEmptyFieldValueAddonAfter
            />
          </Set>
          <Set orientation="horizontal" alignItems="flex-end">
            <DateInputRangeField
              label={<ApplicationTimeTrans />}
              startProps={{
                name: "beginCreateOn"
              }}
              endProps={{
                name: "endCreateOn"
              }}
              minDate={minDate}
              maxRangeDays={maxRangeDays}
              css={css`
                input {
                  border-top-right-radius: 0 !important;
                  border-bottom-right-radius: 0 !important;
                  &:focus {
                    box-shadow: none !important;
                  }
                }
              `}
            />
            <DateInputRangeField
              label={<UpdatedTimeTrans />}
              startProps={{
                name: "beginUpdateOn"
              }}
              endProps={{
                name: "endUpdateOn"
              }}
              minDate={minDate}
              maxRangeDays={maxRangeDays}
              css={css`
                input {
                  border-top-right-radius: 0 !important;
                  border-bottom-right-radius: 0 !important;
                  &:focus {
                    box-shadow: none !important;
                  }
                }
              `}
            />
            <SearchButton
              isLoading={isLoading}
              disabled={isLoading}
              alignSelf="flex-end"
            />
          </Set>
        </FieldStack>
      </form>
    </FormProvider>
  )
}

const StatusCell = ({ value }) => {
  return <FundWithdrawStatusBox value={value} data-status={value} />
}

const useColumns = ({
  brandId,
  items = [],
  mutate,
  setDelayUpdate,
  manualBrandPaymentIdList = []
}) => {
  let hasUpdateMenu = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      sequenceColumn({
        Header: "#"
      }),
      noWrapTextColumn({
        accessor: "username",
        Header: <UserNameTrans />,
        disableSortBy: true
      }),
      noWrapTextColumn({
        accessor: "userType",
        Header: <UserTypeTrans />,
        Cell: ({ value }) => <UserTypeLabel value={value} />
      }),
      noWrapTextColumn({
        accessor: "orderNo",
        Header: <GmsIdTrans />,
        disableSortBy: true
      }),
      noWrapTextColumn({
        accessor: "thirdPartyOrderNo",
        Header: <ThirdPartyIdTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <WithdrawAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "actualAmount",
        accessor: (row) => row,
        Header: <ActualWithdrawAmountTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          let { status, amount, actualAmount } = record
          if (!isFundPaid(status)) {
            return null
          }

          return <FormattedNumberDecimal value={actualAmount ?? amount} />
        }
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <ApplicationTimeTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "paidOn",
        Header: <PaidTimeTrans />,
        disableSortBy: true,
        placeholder: "-"
      }),
      noWrapTextColumn({
        accessor: "status",
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: StatusCell
      }),
      noWrapTextColumn({
        accessor: "reviewedUserName",
        Header: <OperatorTrans />,
        disableSortBy: true
      }),
      noWrapTextColumn({
        accessor: "remark",
        Header: <RemarkTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <Box>{value}</Box>
      })
    ]

    if (hasUpdateMenu) {
      columns.push(
        noWrapTextColumn({
          id: "actions",
          accessor: (row) => row,
          disableSortBy: true,
          Header: <ActionTrans />,
          Cell: ({ value, status }) => {
            let { brandPaymentId } = value
            let underReview = isFundUnderReview(value?.status)

            let reviewPaid = isFundApproved(value?.status) /* &&
              manualBrandPaymentIdList.includes(brandPaymentId)
              */

            let invalid = isFundInvalid(value?.status)

            let isPlayer = value?.userType === "Player"
            return (
              <Set
                alignX="center"
                orientation="horizontal"
                css={css`
                  width: max-content;
                `}
              >
                {underReview && (
                  <VerifyFundWithdrawDisclosure
                    id="verify-withdraw-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
                    playerCode={isPlayer && value?.userId}
                    onSubmitted={mutate}
                    onVisibleChange={(visible) => {
                      let delayUpdate = visible
                      setDelayUpdate(delayUpdate)
                    }}
                  />
                )}
                {reviewPaid && (
                  <FundWithdrawPaidDialogDisclosure
                    id="review-paid-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
                    onSubmitted={mutate}
                    onVisibleChange={(visible) => {
                      let delayUpdate = visible
                      setDelayUpdate(delayUpdate)
                    }}
                  />
                )}
                <ViewFundWithdrawDisclosure
                  id="view-withdraw-dialog-disclosure"
                  brandId={brandId}
                  formId={value.id}
                  onVisibleChange={(visible) => {
                    let delayUpdate = visible
                    setDelayUpdate(delayUpdate)
                  }}
                />
                {invalid && (
                  <RejectFundWithdrawDisclosure
                    id="reject-withdraw-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
                    onSubmitted={mutate}
                    onVisibleChange={(visible) => {
                      let delayUpdate = visible
                      setDelayUpdate(delayUpdate)
                    }}
                  />
                )}
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items), JSON.stringify(manualBrandPaymentIdList)])
}
