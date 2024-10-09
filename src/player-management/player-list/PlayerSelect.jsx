import React, {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext
} from "react"
import { css, Global } from "@emotion/react"
import { Box, Popover } from "bumbag"
import { AsyncPaginate } from "react-select-async-paginate"
import { API, usePlayerList } from "./client"
import { urlWith } from "../../client"
import {
  useForm,
  useFormContext,
  Controller,
  useWatch,
  useFormState
} from "react-hook-form"
import { Components } from "../../select/MultiSelectBox"
import { getAcceptLangCulture, useTrans } from "../../i18n"
import { isArray } from "lodash-es"
import { SortOrder } from "../../table/order"
import { usePlayerUsernameTrans } from "../../trans/Player"

//TODO: support group option?
//TODO: support controlled value?
export const PlayerSelect = ({
  name = "",
  isMulti,
  brandId,
  autoFocus,
  placeholder,
  rows = 10,
  required,
  ...props
}) => {
  let formMethods = useFormContext()

  let defaultPlaceholder = usePlayerUsernameTrans()

  placeholder = placeholder ?? defaultPlaceholder

  const [options, setOptions] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data, isLoading, error } = usePlayerList({
    brandId,
    page,
    rows,
    username: search,
    sortby: "username",
    orderby: SortOrder.Ascending
  })

  useEffect(() => {
    if (!isLoading && data) {
      const newOptions = data.items.map((player) => ({
        label: player.username,
        value: player.playerCode
      }))

      setOptions((prev) => (page === 1 ? newOptions : [...prev, ...newOptions]))

      const loadedSize = (page - 1) * rows + data.items.length
      setHasMore(loadedSize < data.totalCount)
    }
  }, [data, page, isLoading])

  const loadOptions = (inputValue, loadedOptions, { page }) => {
    setSearch(inputValue)
    setPage(page)

    return {
      options,
      hasMore,
      additional: {
        page: page + 1
      }
    }
  }

  return (
    <Controller
      name={name}
      control={formMethods?.control}
      rules={{ required }}
      render={({
        field,
        fieldState: { isTouched, isDirty, error },
        formState
      }) => {
        return (
          <AsyncPaginate
            name={name}
            isMulti={isMulti}
            autoFocus={autoFocus}
            placeholder={placeholder}
            // menuIsOpen={true}
            defaultOptions
            loadOptions={loadOptions}
            onChange={(raw) => {
              const value = isArray(raw)
                ? raw.map(({ value }) => value)
                : raw.value

              formMethods.setValue(name, value)
              props?.onChange?.(value, raw)
            }}
            additional={{
              page: 1
            }}
            components={Components}
            {...props}
          />
        )
      }}
    />
  )
}
