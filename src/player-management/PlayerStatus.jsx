import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Badge } from "bumbag"
import { useTrans, Trans } from "../i18n"
import Select from "../select/Select"
import {
  useInBlacklistTrans,
  useStatusTrans,
  InBlacklistTrans
} from "../trans/Status"
import {
  PlayerStatusRegisterUndoneTrans,
  usePlayerStatusRegisterUndoneTrans
} from "../trans/Player"
import {
  UserStatusDisabledTrans,
  UserStatusEnabledTrans,
  useUserStatusDisabledTrans,
  useUserStatusEnabledTrans
} from "../trans/User"

const Enabled = "Enabled"

const Disabled = "Disabled"

const InBlacklist = "InBlacklist"

const RegisterUndone = "RegisterUndone"

export const PlayerStatus = {
  Enabled,
  RegisterUndone,
  Disabled,
  InBlacklist
}

export const PlayerStatusSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useStatusTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useUserStatusEnabledTrans(),
      value: Enabled
    },
    {
      label: usePlayerStatusRegisterUndoneTrans(),
      value: RegisterUndone
    },
    {
      label: useUserStatusDisabledTrans(),
      value: Disabled
    },
    {
      label: useInBlacklistTrans(),
      value: InBlacklist
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const PlayerStatusLabel = ({ value = "" }) => {
  switch (value) {
    case Enabled:
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
          <UserStatusEnabledTrans />
        </Badge>
      )
    case Disabled:
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
          <UserStatusDisabledTrans />
        </Badge>
      )
    case InBlacklist:
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
          <InBlacklistTrans />
        </Badge>
      )
    case RegisterUndone:
      return (
        <Badge
          palette="warning"
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
          <PlayerStatusRegisterUndoneTrans />
        </Badge>
      )
  }
  return value
}
