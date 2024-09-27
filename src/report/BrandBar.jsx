import React, { useState, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  useUserBrandId,
  useUserRoleType,
  useUserResellerId,
  useUserLicenseeId
} from "../user/context"
import { MerchantIdSelect } from "../merchant/MerchantSelect"
import { nextRoleType } from "../system/roles/type"
import equals from "fast-deep-equal"
import SubmitButton from "../button/SubmitButton"

const localStorageKey = "selectedMerchant"
const getSelectedMerchantLocalStorage = () => {
  return JSON.parse(localStorage.getItem(localStorageKey))
}
const setMerchantLocalStorage = (key, value) => {
  const merchant = { ...getSelectedMerchantLocalStorage(), [key]: value }
  localStorage.setItem(localStorageKey, JSON.stringify(merchant))
}

export const BrandBar = ({
  id = "page-merchant-bar",
  name = "brandBar",
  onLicenseeChange,
  onBrandChange,
  onResellerChange,
  ...props
}) => {
  let location = useLocation()
  let navigate = useNavigate()

  let userRoleType = useUserRoleType()

  let userResellerId = useUserResellerId()
  let userLicenseeId = useUserLicenseeId()
  let userBrandId = useUserBrandId()

  let [state, setState] = useState({
    resellerId: userResellerId ?? getSelectedMerchantLocalStorage()?.resellerId,
    licenseeId: userLicenseeId ?? getSelectedMerchantLocalStorage()?.licenseeId,
    brandId: userBrandId ?? getSelectedMerchantLocalStorage()?.brandId
  })

  useEffect(() => {
    if (!equals(state, location?.state)) {
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location?.state,
          ...state
        }
      })
    }
  }, [JSON.stringify(state), JSON.stringify(location?.state ?? {})])

  useEffect(() => {
    setMerchantLocalStorage("brandId", state.brandId)
    // onBrandChange?.(state?.brandId)
  }, [state?.brandId])

  useEffect(() => {
    setMerchantLocalStorage("licenseeId", state.licenseeId)
    // onLicenseeChange?.(state?.licenseeId)
  }, [state?.licenseeId])

  useEffect(() => {
    setMerchantLocalStorage("resellerId", state.resellerId)
    // onResellerChange?.(state?.resellerId)
  }, [state?.resellerId])

  const onSubmit = () => {
    onBrandChange?.(state?.brandId)
    onLicenseeChange?.(state?.licenseeId)
    onResellerChange?.(state?.resellerId)
  }

  useEffect(() => {
    onSubmit()
  }, [])

  let formMethods = useForm()

  if (userBrandId) {
    return null
  }

  return (
    <FormProvider {...formMethods}>
      <MerchantIdSelect
        id={id}
        start={nextRoleType(userRoleType)}
        resellerProps={{
          value: state?.resellerId,
          onChange: (resellerId) => {
            setState((prevState) => ({
              ...prevState,
              resellerId,
              licenseeId: "",
              brandId: ""
            }))
          }
        }}
        licenseeProps={{
          value: state?.licenseeId,
          onChange: (licenseeId) => {
            setState((prevState) => ({
              ...prevState,
              licenseeId,
              brandId: ""
            }))
          }
        }}
        brandProps={{
          value: state?.brandId,
          onChange: (brandId) => {
            setState((prevState) => ({
              ...prevState,
              brandId
            }))
          }
        }}
        {...props}
      >
        <SubmitButton onClick={onSubmit} />
      </MerchantIdSelect>
    </FormProvider>
  )
}

export default BrandBar
