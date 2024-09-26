import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text, Set, Icon, Badge } from "bumbag"
import {
  faCertificate,
  faCheck,
  faUserCheck,
  faUserSlash
} from "@fortawesome/free-solid-svg-icons"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import {
  ApprovedTrans,
  RejectedTrans,
  ReviewTrans,
  useApprovedTrans,
  useRejectedTrans,
  useReviewTrans
} from "../../trans/Status"
import { usePlayerIdVerificationStatusTrans } from "../../trans/Player"

const WaitingVerify = "WaitingVerify"

const Approve = "Approve"

const Reject = "Reject"

export const isApprove = (value) => value === Approve

export const isReject = (value) => value === Reject

export const isApproveOrReject = (value) => isApprove(value) || isReject(value)

export const isPlayerIdentityWaitingVerify = (value) => {
  return value === WaitingVerify
}

export const PlayerIdentitySelect = ({ ...props }) => {
  let placeholder = usePlayerIdVerificationStatusTrans()
  let options = [
    {
      label: useReviewTrans(),
      value: WaitingVerify
    },
    {
      label: useApprovedTrans(),
      value: Approve
    },
    {
      label: useRejectedTrans(),
      value: Reject
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const PlayerIdentityStateLabel = ({ value = "" }) => {
  switch (value) {
    case WaitingVerify:
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
    case Approve:
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
          <ApprovedTrans />
        </Badge>
      )
    case Reject:
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

export const PlayerIdentityStateIcon = ({ value }) => {
  switch (value) {
    case true:
      return <Icon icon={faUserCheck} type="font-awesome" color="green" />
    case false:
      return <Icon icon={faUserSlash} type="font-awesome" color="gray" />
    default:
      return null
  }
}

export default {
  WaitingVerify
}
