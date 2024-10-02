import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import { useStatusTrans } from "../../trans/Status"
import { CustomBadgeLabel } from "../../styles/button"
import { Badge } from "bumbag"

const Disabled = "Disabled"
const DisabledTrans = {
  zh: "封锁",
  en: Disabled
}

const Enabled = "Enabled"
const EnabledTrans = {
  zh: "活跃",
  en: "Enabled"
}

export const AdminStatusLabel = ({ value }) => {
  switch (value) {
    case Disabled:
      return (
        <CustomBadgeLabel>
          <Badge palette="danger">
            <Trans {...DisabledTrans} />
          </Badge>
        </CustomBadgeLabel>
      )

    case Enabled:
      return (
        <CustomBadgeLabel>
          <Badge palette="success">
            <Trans {...EnabledTrans} />
          </Badge>
        </CustomBadgeLabel>
      )

    default:
      return value
  }
}

export const AdminStatusSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useStatusTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(EnabledTrans),
      value: Enabled
    },
    {
      label: useTrans(DisabledTrans),
      value: Disabled
    }
  ]
  return <Select placeholder={placeholder} options={options} {...props} />
}
