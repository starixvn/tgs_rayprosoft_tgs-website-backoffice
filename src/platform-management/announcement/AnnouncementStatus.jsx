import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Badge, Button } from "bumbag"
import { Locales, Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { useChangeAnnouncementStatus } from "./client"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import {
  EffectiveTrans,
  ExpiredTrans,
  InvalidTrans,
  RejectedTrans,
  ReviewTrans
} from "../../trans/Status"

export const InVerify = "InVerify"

export const Effective = "Effective"

export const Invalid = "Invalid"

export const Expired = "Expired"

export const Rejected = "Rejected"

export const AnnouncementStatusLabel = ({ value = "" }) => {
  switch (value) {
    case InVerify:
      return (
        <Badge
          palette="info"
          css={css`
            font-size: 12px;
            font-weight: 700;
            padding: 2px 4px;
            min-height: 18px;
            white-space: nowrap;
            color: #fff;
            border-radius: 0.375rem;
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
            font-size: 12px;
            font-weight: 700;
            padding: 2px 4px;
            min-height: 18px;
            white-space: nowrap;
            color: #fff;
            border-radius: 0.375rem;
          `}
        >
          <EffectiveTrans />
        </Badge>
      )

    case Invalid:
      return (
        <Badge
          palette="danger"
          css={css`
            font-size: 12px;
            font-weight: 700;
            padding: 2px 4px;
            min-height: 18px;
            white-space: nowrap;
            color: #fff;
            border-radius: 0.375rem;
          `}
        >
          <InvalidTrans />
        </Badge>
      )

    case Expired:
      return (
        <Badge
          css={css`
            font-size: 12px;
            font-weight: 700;
            padding: 2px 4px;
            min-height: 18px;
            white-space: nowrap;
            color: #fff;
            background-color: #212631;
            border-radius: 0.375rem;
            background-image: linear-gradient(45deg, #3c4b64 0%, #212333 100%);
          `}
        >
          <ExpiredTrans />
        </Badge>
      )

    case Rejected:
      return (
        <Badge
          palette="danger"
          css={css`
            font-size: 12px;
            font-weight: 700;
            padding: 2px 4px;
            min-height: 18px;
            white-space: nowrap;
            color: #fff;
            border-radius: 0.375rem;
          `}
        >
          <RejectedTrans />
        </Badge>
      )

    default:
      return value
  }
}

// Effective <-> Invalid toggle
export const AnnouncementStatusToggleButton = ({
  record,
  onSubmitted,
  disabled,
  ...props
}) => {
  let editable = useIsDisplayMenuByRoute([Update])

  let { id, status } = record
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useChangeAnnouncementStatus(id, formData)

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result, error])

  let palette =
    status === Invalid ? "danger" : status === Effective ? "success" : "default"
  if (!editable) {
    return (
      <Button
        data-status={record.status}
        isLoading={isLoading}
        palette={palette}
        isStatic
      >
        <AnnouncementStatusLabel value={record.status} />
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
      <div
        data-status={record.status}
        isLoading={isLoading}
        disabled={isLoading || disabled}
        palette={palette}
        onClick={() => {
          reset()

          let newStatus = status === Invalid ? Effective : Invalid
          setSubmit(newStatus)
        }}
        css={css`
          white-space: nowrap;
          cursor: pointer;
        `}
      >
        <AnnouncementStatusLabel value={record.status} />
      </div>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
