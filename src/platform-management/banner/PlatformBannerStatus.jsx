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

const InVerify = "WaitApproving"

const Effective = "Approved"

const Expired = "expired"

const Rejected = "Rejected"

export const PlatformBannerStatusLabel = ({ value = "" }) => {
  switch (value) {
    case "WaitApprving": //TODO: rm after 1.8
    case InVerify:
      return (
        <Badge
          palette="info"
          css={css`
            font-size: 0.75em;
            font-weight: 700;
            padding: 2px 4px;
            border-radius: 4px;
            color: #fff;
            display: inline;
          `}
        >
          <ReviewTrans />
        </Badge>
      )

    case Effective:
      return (
        <Badge
          palette="success"
          css={css`
            font-size: 0.75em;
            font-weight: 700;
            padding: 2px 4px;
            border-radius: 4px;
            color: #fff;
            display: inline;
          `}
        >
          <EffectiveTrans />
        </Badge>
      )

    case Expired:
      return <ExpiredTrans />

    case Rejected:
      return (
        <Badge
          palette="danger"
          css={css`
            font-size: 0.75em;
            font-weight: 700;
            padding: 2px 4px;
            border-radius: 4px;
            color: #fff;
            display: inline;
          `}
        >
          <RejectedTrans />
        </Badge>
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
      <Button isLoading={isLoading} palette={palette} disabled isStatic>
        <BannerLabel value={isEnabled} />
      </Button>
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
