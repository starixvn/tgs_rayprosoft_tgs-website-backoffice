import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Badge, Button, useModalState } from "bumbag"
import { Locales, Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { useChangePlatformBannerStatus } from "./client"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import {
  EffectiveTrans,
  ExpiredTrans,
  InvalidTrans,
  RejectedTrans,
  ReviewTrans
} from "../../trans/Status"
import { CustomBadgeButton, CustomBadgeLabel } from "../../styles/button"

const InVerify = "WaitApproving"

const Effective = "Approved"

const Expired = "expired"

const Rejected = "Rejected"

export const PlatformBannerStatusLabel = ({ value = "" }) => {
  switch (value) {
    case "WaitApprving": //TODO: rm after 1.8
    case InVerify:
      return (
        <CustomBadgeLabel>
          <Badge palette="info">
            <ReviewTrans />
          </Badge>
        </CustomBadgeLabel>
      )

    case Effective:
      return (
        <CustomBadgeLabel>
          <Badge palette="success">
            <EffectiveTrans />
          </Badge>
        </CustomBadgeLabel>
      )

    case Expired:
      return <ExpiredTrans />

    case Rejected:
      return (
        <CustomBadgeLabel>
          <Badge palette="danger">
            <RejectedTrans />
          </Badge>
        </CustomBadgeLabel>
      )

    default:
      return value
  }
}

export const PlatformBannerStatusToggleButton = ({
  brandId,
  record,
  onSubmitted,
  disabled,
  ...props
}) => {
  let editable = useIsDisplayMenuByRoute([Update])

  let { id, isEnabled } = record
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useChangePlatformBannerStatus(brandId, id, formData)

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result, error])

  let palette = isEnabled ? "success" : "danger"

  if (!editable) {
    return (
      <CustomBadgeButton>
        <Button
          isLoading={isLoading}
          palette={palette}
          isStatic
          css={css`
            opacity: ${disabled ? "0.7" : "1"} !important;
            cursor: ${disabled ? "not-allowed" : "pointer"} !important;
          `}
        >
          <BannerLabel value={isEnabled} />
        </Button>
      </CustomBadgeButton>
    )
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)

    setSubmit(undefined)
  }

  return (
    <>
      <Button
        data-status={isEnabled ? "enable" : "disable"}
        isLoading={isLoading}
        disabled={isLoading || disabled}
        palette={palette}
        onClick={() => {
          reset()
          let newStatus = isEnabled ? "disable" : "enable"
          setSubmit(newStatus)
        }}
        css={css`
          white-space: nowrap;
          font-size: 0.75em;
          font-weight: 700;
          padding: 1px 4px;
          min-height: auto;
          color: #fff;
          opacity: 1 !important;
          &:focus {
            box-shadow: none !important;
          }
        `}
      >
        <BannerLabel value={isEnabled} />
      </Button>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}

const BannerLabel = ({ value, ...props }) =>
  value ? <EffectiveTrans /> : <InvalidTrans />
