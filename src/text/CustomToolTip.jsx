// import { Tooltip } from "bumbag"
import React from "react"
import { cssCustomToolTip } from "../styles/tooltip"

export default function CustomToolTip({ placement, text, maxLength }) {
  const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) {
      return str
    }
    return str.substring(0, maxLength) + "..."
  }
  const truncatedText = truncateString(text, maxLength)
  return (
    <div className="wraper-tooltip" css={cssCustomToolTip}>
      <div className="tooltip-container">
        {truncatedText}
        {text.length > maxLength && (
          <div className={`tooltip tooltip-${placement}`}>{text}</div>
        )}
      </div>
    </div>
  )
}
