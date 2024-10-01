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
import { CustomBadgeStatus } from "../styles/status"

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
        <CustomBadgeStatus>
          <Badge palette="success">
            <UserStatusEnabledTrans />
          </Badge>
        </CustomBadgeStatus>
      )
    case Disabled:
      return (
        <CustomBadgeStatus>
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
            <UserStatusDisabledTrans />
          </Badge>
        </CustomBadgeStatus>
      )
    case InBlacklist:
      return (
        <CustomBadgeStatus>
          <Badge palette="danger">
            <InBlacklistTrans />
          </Badge>
        </CustomBadgeStatus>
      )
    case RegisterUndone:
      return (
        <CustomBadgeStatus>
          <Badge palette="warning">
            <PlayerStatusRegisterUndoneTrans />
          </Badge>
        </CustomBadgeStatus>
      )
  }
  return value
}
