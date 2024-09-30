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
import { CustomBadgeLabel } from "../../styles/button"

export const InVerify = "InVerify"

export const Effective = "Effective"

export const Invalid = "Invalid"

export const Expired = "Expired"

export const Rejected = "Rejected"

export const AnnouncementStatusLabel = ({ value = "" }) => {
  switch (value) {
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

    case Invalid:
      return (
        <CustomBadgeLabel>
          <Badge palette="danger">
            <InvalidTrans />
          </Badge>
        </CustomBadgeLabel>
      )

    case Expired:
      return (
        <CustomBadgeLabel>
          <Badge
            css={css`
              background-color: #212631;
              background-image: linear-gradient(
                45deg,
                #3c4b64 0%,
                #212333 100%
              );
            `}
          >
            <ExpiredTrans />
          </Badge>
        </CustomBadgeLabel>
      )

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
      <div
        data-status={record.status}
        isLoading={isLoading}
        palette={palette}
        isStatic
        css={css`
          white-space: nowrap;
        `}
      >
        <AnnouncementStatusLabel value={record.status} />
      </div>
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
