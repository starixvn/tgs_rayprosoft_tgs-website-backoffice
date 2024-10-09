import React from "react"
import { Box, Popover, usePopoverState } from "bumbag"
import { faClipboard } from "@fortawesome/free-solid-svg-icons"
import copy from "clipboard-copy"
import { Trans } from "../i18n"
import { customPopover } from "../styles/popover"

export const CopyTextBox = ({
  width = "100%",
  isCopy = true,
  value = "",
  maxLength = null,
  ...props
}) => {
  const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) {
      return str
    }
    return str.substring(0, maxLength) + "..."
  }
  const truncatedText = truncateString(value, maxLength)

  let popover = usePopoverState()

  return (
    <Box>
      <Popover.Disclosure
        {...popover}
        onClick={() => isCopy && copy(value)}
        {...props}
        style={{ cursor: value?.length > maxLength ? "pointer" : "default" }}
      >
        <span title={value}>{truncatedText}</span>
      </Popover.Disclosure>
      {popover.visible && value?.length > maxLength && (
        <Popover
          hasArrow
          maxWidth="70vw"
          whiteSpace="normal"
          {...popover}
          css={customPopover}
          wordBreak="break-word"
        >
          <Trans
            zh={`复制了 ${value}`}
            en={`${value} ${!isCopy ? "" : "Copied"}`}
          />
        </Popover>
      )}
    </Box>
  )
}
