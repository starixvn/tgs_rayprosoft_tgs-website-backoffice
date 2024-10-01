import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Level, Set, Text, Box } from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code, Update } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Trans, useTrans } from "../../i18n"
import { SearchButton } from "../../button/SearchButton"
import equals from "fast-deep-equal"
import {
  useBrandGameProviderList,
  useChangeBrandProviderOrders
} from "./client"
import { useFormattedTimeString } from "../../date/format"
import { useFormattedDay } from "../../date/week"
import { StatusMenu } from "./status"
import { EditButton } from "./edit"
import { EditPresetButton } from "./PresetMaintenance"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import { OrderTrans } from "../../trans/Field.jsx"
import AlertDialog from "../../dialog/Alert"
import { ActionTrans, ConfirmOrderTrans } from "../../trans/Action"
import { StatusTrans } from "../../trans/Status"
import {
  GameProviderListTrans,
  GameProviderNameTrans,
  useGameProviderNameTrans
} from "../../trans/Game"
import { PeriodicMaintenanceTimeTrans } from "../../trans/Date"
import { NumberInput } from "../../input/NumberInput"

import { Dialog, Button } from "bumbag"
import { WrapperBg } from "../../styles/wrapper.js"
import { CustomTableStyle } from "../../styles/tablle.js"
import {
  ActionTableButton,
  SearchAndSubmitButton
} from "../../styles/button.js"
import { CustomInputSearch } from "../../styles/input.js"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<GameProviderListTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let brandId = usePlatformId()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    keyword: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { isLoading, data, error, mutate, emptyData } = useBrandGameProviderList({
    ...toApiParams(state),
    sortby: "displayOrder"
  })

  let formMethods = useForm()

  let [submitData, setSubmit] = useState()
  let {
    result,
    isLoading: isChangingDisplayOrder,
    error: changeOrderError,
    deleteCache
  } = useChangeBrandProviderOrders(submitData)

  const onSubmit = (formData) => {
    let orders = []
    Object.entries(displayOrders).forEach(([id, value]) => {
      orders.push({
        id,
        displayOrder: value
      })
    })

    if (orders.length > 0) {
      setSubmit({
        orders
      })
    }
  }

  const reset = () => {
    setDisplayOrders({})
    setSubmit(undefined)
  }

  useEffect(() => {
    if (result && !error) {
      reset()
      mutate()
    }
  }, [result, error])

  let [displayOrders, setDisplayOrders] = useState({})

  const setDisplayOrder = (id, displayOrder) => {
    setDisplayOrders((state) => {
      Reflect.set(state, id, displayOrder)
      return state
    })
  }

  let columns = useColumns({
    items: data?.items,
    mutate,
    displayOrders,
    setDisplayOrder
  })

  return (
    <Set orientation="vertical" isFilled height="100%">
      <WrapperBg>
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            keyword={state.keyword}
            search={(data = {}) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
          />
        </Level>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <CustomTableStyle>
              <Table
                columns={columns}
                data={data?.items}
                pageCount={pageCount(state.pageSize, data?.totalCount)}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
              />
            </CustomTableStyle>
            {
              <Dialog.Footer position="sticky" bottom="0">
                <SearchAndSubmitButton>
                  <Button isLoading={isChangingDisplayOrder} type="submit">
                    <ConfirmOrderTrans />
                  </Button>
                </SearchAndSubmitButton>
              </Dialog.Footer>
            }
          </form>
        </FormProvider>
        {error && <AlertDialog {...error} onClickClose={emptyData} />}
        {changeOrderError && (
          <AlertDialog {...changeOrderError} onClickClose={emptyData} />
        )}
      </WrapperBg>
    </Set>
  )
}

const SearchBar = ({ name: keyword = "", search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      keyword: ""
    }
  })

  let searchPlaceHolder = useGameProviderNameTrans()

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set marginBottom="8px">
          <CustomInputSearch>
            <InputField
              name="keyword"
              showEmptyFieldValueAddonAfter
              placeholder={searchPlaceHolder}
              autocomplete="off"
            />
          </CustomInputSearch>
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({
  items = [],
  mutate,
  displayOrders = {},
  setDisplayOrder
}) => {
  let hasUpdateMenu = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      {
        id: "displayOrder",
        accessor: (record) => record,
        Header: <OrderTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { id } = value
          let displayOrder = displayOrders[id] ?? value.displayOrder
          return (
            <NumberInput
              name={id}
              size="small"
              width="5em"
              defaultValue={displayOrder}
              required
              min="1"
              minLength="1"
              registerOptions={{
                valueAsNumber: true
              }}
              onChange={(event) => {
                let displayOrder = parseInt(event.target.value)
                if (Number.isFinite(displayOrder)) {
                  setDisplayOrder(id, displayOrder)
                }
              }}
            />
          )
        }
      },
      {
        accessor: "id",
        Header: <Trans zh="ID" en="ID" />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        accessor: "gameProviderName",
        Header: <GameProviderNameTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        id: "maintenanceTime",
        accessor: (record) => record,
        Header: <PeriodicMaintenanceTimeTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { dayOfWeek, from, to } = value
          return (
            <Text.Block whiteSpace="nowrap">
              {`${useFormattedDay(dayOfWeek)} ${useFormattedTimeString(
                from
              )} - ${useFormattedTimeString(to)}`}
            </Text.Block>
          )
        }
      },
      {
        id: "status",
        accessor: (record) => record,
        Header: <StatusTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          return (
            <Box alignX="center">
              <StatusMenu record={value} onSubmitted={mutate} />
            </Box>
          )
        }
      }
    ]

    if (hasUpdateMenu) {
      columns.push({
        id: "actions",
        accessor: (row) => row,
        disableSortBy: true,
        Header: <ActionTrans />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          return (
            <Set orientation="vertical" alignX="center">
              <ActionTableButton
                css={css`
                  flex-wrap: nowrap;
                  flex-direction: row;
                  gap: 8px;
                `}
              >
                <EditButton record={value} onSubmitted={mutate} />
                <EditPresetButton record={value} onSubmitted={mutate} />
              </ActionTableButton>
            </Set>
          )
        }
      })
    }
    return columns
  }, [JSON.stringify(items)])
}
