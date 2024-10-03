import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch
} from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  FieldStack,
  FieldWrapper,
  Level,
  Dialog,
  Text,
  Label,
  Icon
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  Trans,
  useTrans,
  getAcceptLangCulture,
  useLangCode,
  FormattedNumberDecimal
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code, Export } from "./menu"
import BrandBar from "../../report/BrandBar"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import { startOfNextMinute } from "../../date/startOfNextMinute"
import { textColumn } from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import {
  subDays,
  addMinutes,
  subMinutes,
  differenceInMinutes,
  startOfMinute,
  endOfDay
} from "date-fns"
import DateTimeRangeInput, {
  DateInputRange,
  DateInputRangeField
} from "../../date/DateTimeRangeInput"
import {
  GameRoundStatusLabel,
  GameRoundStatusSelect
} from "../../game/round/GameRoundStatus"
import {
  useGameRoundList,
  useSystemGameRoundList,
  useSystemGameRoundListTotal,
  systemGameRoundListDownloadUrl
} from "../../game/round/client"
import AlertDialog from "../../dialog/Alert"
import { isDev } from "../../env"
import { GameActionDialogDisclosure } from "../../game/round/GameActionDialog"
import { CurrencySelectField } from "../../currency/CurrencySelect"
import { GameTypeSelect } from "../../game/GameType"
import BrandIdSelect from "../../merchant/platforms/BrandIdSelect"
import { GameProviderSubGameProviderSelect } from "../../game/providers/GameProviderSubGameProviderSelect"
import DownloadButton from "../../button/DownloadButton"
import { isValidDate } from "../../date/isValidDate"
import { splitEvery, any } from "ramda"
import { GameRoundDialogDisclosure } from "../../game/round/GameRoundDialog"
import Disclosure from "../../dialog/Disclosure"
import { urlWith } from "../../client"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { AddGameProviderRoundDialogDisclosure } from "./AddGameProviderRoundDialog"
import { formatNumber } from "../../number/format"
import {
  BetAmountTrans,
  ExternalBetTimeTrans,
  ExternalRoundIdTrans,
  GameNameTrans,
  GameProviderTrans,
  RoundIdTrans,
  SubGameProviderTrans,
  TurnoverTrans,
  ValidBetAmountTrans,
  useExternalRoundIdTrans,
  useRoundIdTrans
} from "../../trans/Game"
import { StatusTrans } from "../../trans/Status"
import { UserNameTrans } from "../../trans/User"
import { CurrencyTrans } from "../../trans/Payment"
import { PlayerWinLossTrans } from "../../trans/Player"
import { DetailTrans, ExportTrans, ViewTrans } from "../../trans/Action"
import { SettleAmountTrans } from "../../trans/Field"
import {
  cssTableLineBg,
  cssTableStickyAction,
  CustomTableStyle
} from "../../styles/tablle"
import { ActionTableButton, SearchAndSubmitButton } from "../../styles/button"
import { CustomInputSearch } from "../../styles/input"
import {
  cssButtonInputClose,
  cssDateTimeRangeInputCloseButton,
  cssFlexBox,
  cssMinWidthSelect,
  cssRemoveBorderGroupInput
} from "./style"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

export const Body = () => {
  return <ReportContent />
}

const last10MinRange = () => {
  let now = new Date()
  let end = addMinutes(now, 1)
  let start = subMinutes(end, 10)
  return {
    start: startOfMinute(start),
    end: startOfMinute(end)
  }
}

const useSystemGameRoundData = (searchParams) => {
  let {
    isLoading: isLoadingRoundList,
    data: roundListData,
    error: roundListError,
    mutate: mutateRoundList,
    deleteCache: deleteRoundListCache,
    emptyData: emptyRoundListData
  } = useSystemGameRoundList(searchParams)

  let {
    isLoading: isLoadingTotal,
    data: total,
    error: totalError,
    mutate: mutateTotal,
    deleteCache: deleteTotalCache,
    emptyData: emptyTotalData
  } = useSystemGameRoundListTotal(searchParams)

  return {
    isLoading: isLoadingRoundList ?? isLoadingTotal,
    data: roundListData && total ? { ...roundListData, total } : undefined,
    error: roundListError ?? totalError,
    mutate: (_, shouldRevalidate) => {
      mutateRoundList(_, shouldRevalidate)
      mutateTotal(_, shouldRevalidate)
    },
    deleteCache: () => {
      deleteRoundListCache()
      deleteTotalCache()
    },
    emptyData: () => {
      emptyRoundListData()
      emptyTotalData()
    }
  }
}

const ReportContent = ({}) => {
  let dateRange = last10MinRange()
  let QueryMaxRangeDays = 31

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId: undefined,
    externalFrom: dateRange.start,
    externalTo: dateRange.end,
    externalClosedFrom: undefined,
    externalClosedTo: undefined,
    from: undefined,
    to: undefined,
    closedFrom: undefined,
    closedTo: undefined,
    username: "",
    roundId: "",
    externalRoundId: "",
    status: "",
    gameProviderId: "",
    sortBy: [{ id: "externalCreatedOn", desc: true }]
  })

  let { pageSize, username, roundId, status, gameProviderId } = state

  let culture = useLangCode()

  const toSearchParams = () => ({
    ...toApiParams(state),
    culture
  })

  let { isLoading, data, error, mutate, emptyData } = useSystemGameRoundData(
    toSearchParams()
  )

  let DataRetentionDays = 90
  let minDate = subDays(dateRange.start, DataRetentionDays)
  let maxDate = endOfDay(new Date())

  let columns = useColumns({ items: data?.items })
  let formattedTotalCount = formatNumber(data?.totalCount) || "-"
  return (
    <PageContent
      actionBar={
        <Level alignY="top" alignX="left" verticalBelow="mobile">
          <SearchBar
            externalFrom={state.externalFrom}
            externalTo={state.externalTo}
            externalClosedFrom={state.externalClosedFrom}
            externalClosedTo={state.externalClosedTo}
            from={state.from}
            to={state.to}
            closedFrom={state.closedFrom}
            closedTo={state?.closedTo}
            username={username}
            roundId={roundId}
            externalRoundId={state?.externalRoundId}
            status={status}
            gameProviderId={gameProviderId}
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={QueryMaxRangeDays}
            isLoading={isLoading}
            search={({ ...rest }) => {
              setState({
                pageIndex: 0,
                ...rest
              })
              mutate()
            }}
          />
          <Set
            css={css`
              display: flex;
              flex-wrap: nowrap;
            `}
          >
            <DownloadReportButton
              disabled={data?.items?.length === 0}
              url={systemGameRoundListDownloadUrl(toSearchParams())}
              dateTimeRanges={[
                [state.externalFrom, state.externalTo],
                [state.externalClosedFrom, state.externalClosedTo],
                [state.from, state.to],
                [state.closedFrom, state.to]
              ]}
            />
            <SearchAndSubmitButton>
              <AddGameProviderRoundDialogDisclosure onSubmitted={mutate} />
            </SearchAndSubmitButton>
          </Set>
        </Level>
      }
      title={<Trans zh="订单管理" en="Order Management" />}
    >
      <FieldStack>
        <Text.Block>
          <Trans
            zh={`笔数：${formattedTotalCount}`}
            en={`Rows：${formattedTotalCount}`}
          />
        </Text.Block>
        <CustomTableStyle css={cssTableLineBg}>
          <Table
            columns={columns}
            data={data?.items}
            total={data?.items?.length > 0 && data?.total}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
            getRowId={(row) => row.id}
            stickyHead
            stickyRight
            css={cssTableStickyAction}
          />
        </CustomTableStyle>
      </FieldStack>
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </PageContent>
  )
}

const SearchBar = ({
  externalFrom,
  externalTo,
  externalClosedFrom,
  externalClosedTo,
  from,
  to,
  closedFrom,
  closedTo,
  sortby,
  username,
  roundId,
  externalRoundId,
  status,
  gameProviderId,
  minDate,
  maxDate,
  maxRangeDays,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      externalFrom,
      externalTo,
      externalClosedFrom,
      externalClosedTo,
      from,
      to,
      closedFrom,
      closedTo,
      sortby,
      username,
      roundId,
      externalRoundId,
      status,
      gameProviderId
    }
  })
  let { control, getValues, setValue, clearErrors, watch } = formMethods

  const onSubmit = (data) => search?.(data)

  let playerNamePlaceholder = useTrans({
    zh: "用户名",
    en: "Player Name"
  })
  let externalUsernamePlaceholder = useTrans({
    zh: "三方用戶名",
    en: "Player Code"
  })

  let externalRoundIdPlaceholder = useExternalRoundIdTrans()

  let roundIdPlaceholder = useRoundIdTrans()

  const ExternalFromField = "externalFrom"
  const ExternalToField = "externalTo"

  const ExternalClosedFromField = "externalClosedFrom"
  const ExternalClosedToField = "externalClosedTo"

  const FromField = "from"
  const ToField = "to"

  const ClosedFromField = "closedFrom"
  const ClosedToField = "closedTo"

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <CustomInputSearch>
            <InputField
              name="username"
              showEmptyFieldValueAddonAfter
              placeholder={playerNamePlaceholder}
            />
          </CustomInputSearch>
          <CustomInputSearch>
            <InputField
              name="playerCode"
              showEmptyFieldValueAddonAfter
              placeholder={externalUsernamePlaceholder}
            />
          </CustomInputSearch>
          <CustomInputSearch>
            <InputField
              name="externalRoundId"
              showEmptyFieldValueAddonAfter
              placeholder={externalRoundIdPlaceholder}
            />
          </CustomInputSearch>
          <CustomInputSearch>
            <InputField
              name="roundId"
              showEmptyFieldValueAddonAfter
              placeholder={roundIdPlaceholder}
            />
          </CustomInputSearch>
          <FieldStack
            orientation="horizontal"
            css={css`
              .bb-FieldWrapper {
                margin-right: 8px !important;
              }
            `}
          >
            <DateTimeRangeInputField
              label={<ExternalBetTimeTrans />}
              minDate={minDate}
              maxDate={maxDate}
              maxRangeDays={maxRangeDays}
              startProps={{
                name: ExternalFromField
              }}
              endProps={{
                name: ExternalToField
              }}
              otherDateTimeRangeFields={[
                ExternalClosedFromField,
                ExternalClosedToField,
                FromField,
                ToField,
                ClosedFromField,
                ClosedToField
              ]}
            />
            <DateTimeRangeInputField
              label={<Trans zh="三方结算时间" en="External Closed On" />}
              minDate={minDate}
              maxDate={maxDate}
              maxRangeDays={maxRangeDays}
              fakeTimeLabel
              startProps={{
                name: ExternalClosedFromField
              }}
              endProps={{
                name: ExternalClosedToField
              }}
              otherDateTimeRangeFields={[
                ExternalFromField,
                ExternalToField,
                FromField,
                ToField,
                ClosedFromField,
                ClosedToField
              ]}
            />
          </FieldStack>
          <FieldStack
            orientation="horizontal"
            css={css`
              .bb-FieldWrapper {
                margin-right: 8px !important;
              }
            `}
          >
            <DateTimeRangeInputField
              label={<Trans zh="平台投注时间" en="Created On" />}
              minDate={minDate}
              maxDate={maxDate}
              maxRangeDays={maxRangeDays}
              startProps={{
                name: FromField
              }}
              endProps={{
                name: ToField
              }}
              otherDateTimeRangeFields={[
                ExternalFromField,
                ExternalToField,
                ExternalClosedFromField,
                ExternalClosedToField,
                ClosedFromField,
                ClosedToField
              ]}
            />
            <DateTimeRangeInputField
              label={<Trans zh="平台结算时间" en="Closed On" />}
              minDate={minDate}
              maxDate={maxDate}
              maxRangeDays={maxRangeDays}
              startProps={{
                name: ClosedFromField
              }}
              endProps={{
                name: ClosedToField
              }}
              otherDateTimeRangeFields={[
                ExternalFromField,
                ExternalToField,
                ExternalClosedFromField,
                ExternalClosedToField,
                FromField,
                ToField
              ]}
            />
          </FieldStack>
          <Box css={cssFlexBox}>
            <GameRoundStatusSelect name="status" css={cssMinWidthSelect} />
            <BrandIdSelect name="brandId" css={cssMinWidthSelect} />
            <GameProviderSubGameProviderSelect
              gameProviderProps={{ name: "gameProviderId", required: true }}
              subGameProviderProps={{ name: "subGameProviderCode" }}
              css={cssMinWidthSelect}
            />
            <GameTypeSelect name="gameType" css={cssMinWidthSelect} />
            <CurrencySelectField name="currencyCode" css={cssMinWidthSelect} />
            <SearchButton
              isLoading={isLoading}
              disabled={isLoading}
              css={cssMinWidthSelect}
            />
          </Box>
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      textColumn({
        accessor: "playerName",
        Header: <UserNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "playerCode",
        Header: <Trans zh="三方用戶名" en="Player Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "externalRoundId",
        Header: <ExternalRoundIdTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "externalCreatedOn",
        Header: <ExternalBetTimeTrans />
      }),
      dateTimeColumn({
        accessor: "externalClosedOn",
        Header: <Trans zh="三方结算时间" en="External Closed On" />
      }),
      textColumn({
        accessor: "id",
        Header: <RoundIdTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="平台投注时间" en="Created On" />
      }),
      dateTimeColumn({
        accessor: "closedOn",
        Header: <Trans zh="平台结算时间" en="Closed On" />
      }),
      textColumn({
        accessor: "gameProviderName",
        Header: <GameProviderTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "subGameProviderName",
        Header: <SubGameProviderTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "gameName",
        Header: <GameNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "status",
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: GameRoundStatusLabel
      }),
      textColumn({
        accessor: "currencyCode",
        Header: <CurrencyTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <BetAmountTrans />,
        disableSortBy: true,
        textAlign: "center"
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <ValidBetAmountTrans />,
        disableSortBy: true,
        textAlign: "center"
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <TurnoverTrans />,
        disableSortBy: true,
        textAlign: "center"
      }),
      numberDecimalColumn({
        accessor: "settleAmount",
        Header: <SettleAmountTrans />,
        disableSortBy: true,
        textAlign: "center"
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <PlayerWinLossTrans />,
        disableSortBy: true,
        textAlign: "center"
      }),
      textColumn({
        id: "detail",
        accessor: (record) => record,
        Header: <DetailTrans />,
        TotalCell: () => null,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <ActionTableButton>
                <GameRoundDialogDisclosure
                  dialogId="game-round-dialog"
                  label={
                    <Icon
                      icon={faMagnifyingGlass}
                      type="font-awesome"
                      color="#080a0c"
                      fontSize="16px"
                      fontWeight="400"
                    />
                  }
                  record={record}
                />
                <GameActionDialogDisclosure
                  dialogId="game-action-dialog"
                  roundId={record?.id}
                />
              </ActionTableButton>
            </Set>
          )
        }
      })
    ],
    [JSON.stringify(items)]
  )
}

const DateTimeRangeInputField = ({
  label,
  startProps,
  endProps,
  otherDateTimeRangeFields = [],
  ...props
}) => {
  let { control, getValues, setValue } = useFormContext()

  let startFieldName = startProps?.name
  let endFieldName = endProps?.name
  return (
    <FieldWrapper
      label={<Label margin="10px 0">{label}</Label>}
      css={css`
         .bb-FieldWrapperLabelWrapper {
           margin-bottom: 0.25rem;
         `}
    >
      <Set alignY="center" orientation="horizontal">
        <DateTimeRangeInput
          dateFormat="yyyy/MM/dd HH:mm"
          startProps={startProps}
          endProps={endProps}
          validate={(range) => {
            let allDateTimeRanges = splitEvery(2, [
              range.start,
              range.end,
              ...getValues(otherDateTimeRangeFields)
            ])

            let pass = any(([start, end]) => {
              return isValidDate(start) && isValidDate(end)
            }, allDateTimeRanges)

            return pass ? true : "one-of-date-range-required"
          }}
          {...props}
          css={cssDateTimeRangeInputCloseButton}
        />
        <Button.Close
          size="small"
          onClick={() => {
            setValue(startFieldName, "")
            setValue(endFieldName, "")
          }}
          css={cssButtonInputClose}
        />
      </Set>
    </FieldWrapper>
  )
}

const DownloadReportButton = ({ url, dateTimeRanges = [], ...props }) => {
  let errorDialog = useModalState()
  let auth = useIsDisplayMenuByRoute([Export])
  if (!auth) {
    return null
  }

  let error = null
  let dateTimeRange = dateTimeRanges.find(([start, end]) => {
    return isValidDate(start) && isValidDate(end)
  })
  if (!dateTimeRange) {
    error = (
      <Trans zh={"请选择搜寻时间区间"} en="Please select a search time range" />
    )
  }
  if (dateTimeRange && isMoreThan10Mins(...dateTimeRange)) {
    error = (
      <Trans
        zh="
    搜寻时间区间不能超过10分钟"
        en="Search time range should not exceed ten minutes"
      />
    )
  }

  let exportLabel = <ExportTrans />
  return (
    <>
      {!error && (
        <DownloadButton href={url} {...props}>
          {exportLabel}
        </DownloadButton>
      )}
      {error && <Disclosure {...errorDialog}>{exportLabel}</Disclosure>}
      {errorDialog.visible && (
        <Dialog.Modal
          type="warning"
          footer={<CloseButtonFooter alignX="right" dialog={errorDialog} />}
          {...errorDialog}
        >
          {error}
        </Dialog.Modal>
      )}
    </>
  )
}

const isMoreThan10Mins = (start, end) => {
  let TenMinutes = 10
  return differenceInMinutes(end, start) > TenMinutes
}
