import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Box, Level, Set, Spinner } from "bumbag"
import PageContent from "../../page/Content"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { usePlayerList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { PlayerStatusLabel } from "../PlayerStatus"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useIsAdminUser
} from "../../user/context"
import { Code, View, Update, PhoneFilter } from "./menu"
import { PlayerStatus, PlayerStatusSelect } from "../PlayerStatus"
import { VipLevelSelect } from "../../vip-levels/VipLevelSelect"
import { ViewButton, EditButton } from "./button"
import { Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { VipLevelLabel } from "../../vip-levels/VipLevel"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { startOfNextDay } from "../../date/startOfNextDay"
import { isDev } from "../../env"
import { useBrand } from "../../merchant/platforms/client"
import { useAllAgentSetting } from "../../agent/all-agent/client"
import { SortOrder } from "../../table/order"
import { PlayerDepositFormDialogDisclosure } from "./PlayerDepositFormDialog"
import { PlayerWithdrawFormDialogDisclosure } from "./PlayerWithdrawFormDialog"
import { BankInfoFieldGroup } from "./BankInfoTag"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffectOnce } from "react-use"
import { VipLevelTrans } from "../../trans/Vip"
import {
  PlayerCodeTrans,
  PlayersTrans,
  RegistrationDomainTrans,
  usePlayerCodeTrans,
  useRegistrationDomainTrans
} from "../../trans/Player"
import { StatusTrans } from "../../trans/Status"
import {
  UpperLevelAgentTrans,
  useUpperLevelAgentTrans
} from "../../trans/Agent"
import {
  RealNameTrans,
  RegistrationTimeTrans,
  UserNameTrans,
  usePhoneTrans,
  useRealNameTrans,
  useUserNameTrans
} from "../../trans/User"
import { ActionTrans } from "../../trans/Action"
import { UpgradePlayerToAgentDialogDisclosure } from "./UpgradePlayerToAgentDialog"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<PlayersTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let brandId = usePlatformId()
  let {
    isLoading: isLoadingBrand,
    data: brand,
    error: brandError,
    mutate: mutateBrand
  } = useBrand(brandId)
  let {
    isLoading: isLoadingAllAgent,
    data: allAgentSetting,
    error: allAgentSettingError,
    mutate: mutateAllAgentSetting
  } = useAllAgentSetting(brandId)

  let isLoading = isLoadingBrand || isLoadingAllAgent
  return (
    <Set
      orientation="vertical"
      isFilled
      height="100%"
      css={css`
        padding: 1rem;
        background: #f3f4f7;
      `}
    >
      {isLoading && (
        <Box alignY="center" alignX="center">
          <Spinner />
        </Box>
      )}
      {!isLoading && brandId && brand && (
        <BodyContent
          brandId={brandId}
          brand={brand}
          allAgentSetting={allAgentSetting}
        />
      )}
      {brandError && <AlertDialog {...brandError} onClickClose={mutateBrand} />}
      {allAgentSettingError && (
        <AlertDialog
          {...allAgentSettingError}
          onClickClose={mutateAllAgentSetting}
        />
      )}
    </Set>
  )
}

const BodyContent = ({ brandId = "", brand, allAgentSetting }) => {
  let location = useLocation()
  let navigate = useNavigate()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    status: PlayerStatus.Enabled,
    vipId: "",
    username: location?.state?.playerUsername ?? "",
    parentUsername: "",
    beginRegisteredOn: "",
    endRegisteredOn: ""
  })

  useEffectOnce(() => {
    if (location?.state?.playerUsername) {
      let state = { ...location.state, playerUsername: "" }
      navigate(location.pathname, {
        state,
        replace: true
      })
    }
  }, [location?.state?.playerUsername])

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { endRegisteredOn } = state
  let {
    data = {},
    isLoading,
    mutate,
    error,
    emptyData
  } = usePlayerList({
    ...toApiParams(state),
    sortby: "registeredTime",
    orderby: SortOrder.Descending,
    endRegisteredOn: startOfNextDay(endRegisteredOn)
  })

  let columns = useColumns({
    mutate,
    items: data?.items,
    brandId,
    brand,
    allAgentSetting
  })

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          brandId={brandId}
          brand={brand}
          username={state.username}
          status={state.status}
          allAgentSetting={allAgentSetting}
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
      </Level>
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.playerCode}
        css={css`
          > thead {
            th {
              white-space: nowrap !important;
            }
          }
          > tbody {
            tr {
              &:not(:last-child) {
                border-bottom: 1px solid #dbdfe6 !important;
              }
              &:nth-child(odd) {
                background: none;
                box-shadow: inset 0 0 0 9999px #0000000d;
              }
            }
          }
        `}
      />
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </Set>
  )
}

const SearchBar = ({
  brandId,
  brand,
  username,
  status,
  allAgentSetting,
  search,
  isLoading,
  ...props
}) => {
  let hasPhoneFilterAuth = useIsDisplayMenuByRoute([PhoneFilter])
  let showAllAgent = allAgentSetting?.switch
  let isAdminUser = useIsAdminUser()

  let usernameInputPlaceholder = useUserNameTrans()
  let playerCodePlaceholder = usePlayerCodeTrans()
  let domainInputPlaceholder = useRegistrationDomainTrans()
  let phonePlaceholder = usePhoneTrans()
  let realNamePlaceholder = useRealNameTrans()
  let agentNamePlaceholder = useUpperLevelAgentTrans()
  let allAgentUpperLevelPlaceholder = useTrans({
    zh: "全民代理上級",
    en: "All Agent Upper Level"
  })

  let formMethods = useForm({
    defaultValues: {
      username,
      status
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set
          alignY="bottom"
          css={css`
            .bb-InputFieldGroup,
            .react-datepicker-wrapper {
              input {
                border: 1px solid #dbdfe6;
                &:focus {
                  box-shadow: none !important;
                }
              }
              button {
                &:focus,
                &:hover,
                &:active {
                  box-shadow: none !important;
                  border: 1px solid #dbdfe6;
                  border-left: none;
                  background: #fff;
                }
              }
            }
            #date-range-dropdown-menu {
              button {
                border-right: none;
                &:focus,
                &:hover,
                &:active {
                  box-shadow: none !important;
                  border: 1px solid #dbdfe6;
                  border-right: none;
                }
              }
            }
            margin-bottom: 8px;
          `}
        >
          <PlayerStatusSelect
            name="status"
            css={css`
              min-width: 251px;
              width: 251px;
            `}
          />
          <VipLevelSelect
            name="vipId"
            brandId={brandId}
            css={css`
              min-width: 251px;
              width: 251px;
            `}
          />
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernameInputPlaceholder}
            minLength={2}
            maxLength={256}
            css={css`
              min-width: 251px;
            `}
          />
          {isAdminUser && (
            <InputField
              name="playerCode"
              showEmptyFieldValueAddonAfter
              placeholder={playerCodePlaceholder}
              css={css`
                min-width: 251px;
              `}
            />
          )}
          <InputField
            name="agentName"
            showEmptyFieldValueAddonAfter
            placeholder={agentNamePlaceholder}
            css={css`
              min-width: 251px;
            `}
          />
          {showAllAgent && (
            <InputField
              name="parentUsername"
              showEmptyFieldValueAddonAfter
              placeholder={allAgentUpperLevelPlaceholder}
              css={css`
                min-width: 251px;
              `}
            />
          )}
          <InputField
            name="registerHost"
            showEmptyFieldValueAddonAfter
            placeholder={domainInputPlaceholder}
            css={css`
              min-width: 251px;
            `}
          />
          {hasPhoneFilterAuth && (
            <InputField
              name="phone"
              showEmptyFieldValueAddonAfter
              placeholder={phonePlaceholder}
              css={css`
                min-width: 251px;
              `}
            />
          )}
          <InputField
            name="realName"
            showEmptyFieldValueAddonAfter
            placeholder={realNamePlaceholder}
            minLength={2}
            maxLength={256}
            css={css`
              min-width: 251px;
            `}
          />
          <BankInfoFieldGroup />
          <DateInputRangeField
            showDateDropdownMenu
            fakeTimeLabel
            label={<RegistrationTimeTrans />}
            startProps={{
              name: "beginRegisteredOn"
            }}
            endProps={{
              name: "endRegisteredOn"
            }}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({
  mutate,
  items = [],
  brandId,
  brand,
  allAgentSetting
} = {}) => {
  let isAdminUser = useIsAdminUser()

  let hasViewAuth = useIsDisplayMenuByRoute([View])
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasAnyMenu = hasViewAuth || hasUpdateAuth

  let showAllAgent = allAgentSetting?.switch

  return useMemo(() => {
    let columns = [
      sequenceColumn({
        Header: "#"
      })
    ]

    if (isAdminUser) {
      columns.push(
        textColumn({
          Header: <PlayerCodeTrans />,
          accessor: "playerCode",
          disableSortBy: true
        })
      )
    }

    columns = [
      ...columns,
      textColumn({
        Header: <UserNameTrans />,
        accessor: "username",
        disableSortBy: true
      }),
      textColumn({
        accessor: "realName",
        Header: <RealNameTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "registeredTime",
        Header: <RegistrationTimeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "registerHost",
        Header: <RegistrationDomainTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "agentName",
        Header: <UpperLevelAgentTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "vipLevel",
        Header: <VipLevelTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <VipLevelLabel value={value} placeholder="-" />
      }),
      textColumn({
        accessor: "status",
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PlayerStatusLabel value={value} />
      })
    ]

    if (showAllAgent) {
      columns.push(
        textColumn({
          accessor: "parentUsername",
          Header: <Trans zh="全民代理上級" en="All Agent Upper Level" />,
          disableSortBy: true
        })
      )
    }

    if (hasAnyMenu) {
      columns.push({
        id: "actions",
        disableSortBy: true,
        Header: <ActionTrans />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        accessor: (row) => row,
        Cell: ({ value: player }) => {
          let { playerCode } = player
          return (
            <Set
              alignX="center"
              orientation="horizontal"
              css={css`
                flex-wrap: nowrap;
                > button {
                  padding: 10px 12px;
                  height: 38px;
                  min-height: 38px;
                  &:focus {
                    box-shadow: none !important;
                  }
                }
              `}
            >
              <ViewButton
                id="view-player-dialog-disclosure"
                player={player}
                brandId={brandId}
                brand={brand}
                showParentUsername={showAllAgent}
              />
              <EditButton
                id="edit-player-dialog-disclosure"
                brandId={brandId}
                brand={brand}
                player={player}
                showParentUsername={showAllAgent}
                onSubmitted={mutate}
              />
              <PlayerDepositFormDialogDisclosure
                brandId={brandId}
                playerCode={playerCode}
                dialogId="apply-deposit-form-dialog"
              />
              <PlayerWithdrawFormDialogDisclosure
                brandId={brandId}
                player={player}
                playerCode={playerCode}
                dialogId="apply-withdraw-form-dialog"
              />
              <UpgradePlayerToAgentDialogDisclosure
                brand={brand}
                playerCode={playerCode}
                player={player}
              />
            </Set>
          )
        }
      })
    }

    return columns
  }, [JSON.stringify(items), brand, allAgentSetting])
}
