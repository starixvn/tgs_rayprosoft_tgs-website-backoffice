import { Set } from "bumbag"
import { parseISO } from "date-fns"
import React, { useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import SearchButton from "../../button/SearchButton"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import { thisMonth } from "../../date/range"
import AlertDialog from "../../dialog/Alert"
import { FormattedNumber, Trans } from "../../i18n"
import { InputField } from "../../input/Input"
import PageContent from "../../page/Content"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import textColumn, { ellipsisTextColumn } from "../../table/column/textColumn"
import { SortOrder } from "../../table/order"
import { CopyTextBox } from "../../text/CopyTextBox"
import { parseJSON } from "../../text/json"
import { ActionTrans } from "../../trans/Action"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { LogDetailDialogDisclosure } from "../LogDetailDialog"
import { useApiLogList } from "./client"
import { Code } from "./menu"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const StateQueryName = "state"
const Body = ({}) => {
  let thisMonthRange = thisMonth()
  let { search, ...location } = useLocation()
  let navigate = useNavigate()
  let [searchParams, setSearchParams] = useSearchParams()
  let stateString = new URLSearchParams(search).get(StateQueryName)
  let initState = parseJSON(stateString) ?? {
    from: thisMonthRange.start.toISOString(),
    to: thisMonthRange.end.toISOString()
  }
  if (typeof initState.from === "string") {
    initState.from = parseISO(initState.from)
  }
  if (typeof initState.to === "string") {
    initState.to = parseISO(initState.to)
  }

  let { state, setState, setPageIndex, setSortOrder } = useTable(initState)

  const syncSearchParams = (record) => {
    let search = `${StateQueryName}=${JSON.stringify(record)}`
    setSearchParams(search)
    /*
    TODO: how
    navigate.replace({
      search
    })
    */
  }

  let { pageIndex, pageSize } = state
  let {
    data = {},
    isLoading,
    mutate,
    error,
    deleteCache
  } = useApiLogList({
    ...toApiParams(state),
    sortby: "RecordedOn",
    orderby: SortOrder.Descending
  })

  let columns = useColumns({ mutate, items: data?.items })

  return (
    <PageContent
      title={<Trans zh="API Logs" en="API Logs" />}
      actionBar={
        <SearchBar
          start={state?.from}
          end={state?.to}
          responseCode={state?.responseCode}
          trackingId={state?.trackingId}
          ip={state?.ip}
          path={state?.path}
          prefix={state?.prefix}
          serverName={state?.serverName}
          method={state?.method}
          search={({ start, end, ...data } = {}) => {
            let record = {
              pageIndex: 0,
              from: start,
              to: end,
              ...data
            }
            setState(record)
            mutate()

            syncSearchParams(record)
          }}
          isLoading={isLoading}
        />
      }
    >
      <Table
        controlledState={state}
        columns={columns}
        data={data?.items}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={(pageIndex) => {
          setPageIndex(pageIndex)

          syncSearchParams({ ...state, pageIndex })
        }}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        stickyHead
      />
      {error && (
        <AlertDialog
          {...error}
          onClickClose={() => {
            deleteCache()
            mutate({ data: undefined }, false)
          }}
        />
      )}
    </PageContent>
  )
}

const SearchBar = ({
  start,
  end,
  responseCode,
  trackingId,
  ip,
  path,
  prefix,
  method,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end,
      responseCode,
      trackingId,
      ip,
      path,
      prefix,
      method
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateTimeRangeInput showDateDropdownMenu />
          <InputField
            name="responseCode"
            showEmptyFieldValueAddonAfter
            placeholder="Response Code"
          />
          <InputField
            name="trackingId"
            showEmptyFieldValueAddonAfter
            placeholder="Tracking Id"
          />
          <InputField
            name="ip"
            showEmptyFieldValueAddonAfter
            placeholder="IP"
          />
          <InputField
            name="path"
            showEmptyFieldValueAddonAfter
            placeholder="Path"
          />
          <InputField
            name="prefix"
            showEmptyFieldValueAddonAfter
            placeholder="Prefix"
          />
          <InputField
            name="serverName"
            showEmptyFieldValueAddonAfter
            placeholder="Server Name"
          />
          <InputField
            name="method"
            showEmptyFieldValueAddonAfter
            placeholder="Method"
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] } = {}) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "id",
        Header: <Trans zh="ID" en="ID" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      textColumn({
        accessor: "trackingId",
        Header: <Trans zh="Tracking Id" en="Tracking Id" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      textColumn({
        accessor: "ip",
        Header: <Trans zh="IP" en="IP" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      ellipsisTextColumn({
        accessor: "path",
        Header: <Trans zh="Path" en="Path" />,
        disableSortBy: true,
        textAlign: "left",
        maxWidth: "20rem",
        Cell: ({ value = "" }) => (
          <CopyTextBox value={value} whiteSpace="normal" textAlign="left" />
        )
      }),
      textColumn({
        accessor: "method",
        Header: <Trans zh="Method" en="Method" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "prefix",
        Header: <Trans zh="Prefix" en="Prefix" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "serverName",
        Header: <Trans zh="Server Name" en="Server Name" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "responseCode",
        Header: <Trans zh="Response Code" en="Response Code" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "executionTimeMs",
        Header: <Trans zh="Execution Time Ms" en="Execution Time Ms" />,
        disableSortBy: true,
        Cell: ({ value }) => <FormattedNumber value={value} />
      }),
      dateTimeColumn({
        accessor: "recordedOn",
        Header: <Trans zh="Recorded On" en="Recorded On" />,
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <ActionTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Set alignX="center">
              <LogDetailDialogDisclosure record={value} />
            </Set>
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
