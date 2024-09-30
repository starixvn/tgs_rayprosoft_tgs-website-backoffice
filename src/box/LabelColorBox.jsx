import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Box } from "bumbag"
import { matchSorter } from "match-sorter"
import { head } from "lodash-es"
import { CustomStatusLabel } from "../styles/status"

const paris = [
  [
    "WaitingPayment",
    css`
      background: #ffa843;
    `
  ],
  [
    "Review",
    css`
      background: #1e67d5;
    `
  ],
  [
    "Approved",
    css`
      background: #58b95c;
    `
  ],
  [
    "Paid",
    css`
      background: #58b95c;
    `
  ],
  [
    "Rejected",
    css`
      background: #e55353;
    `
  ],
  [
    "Invalid",
    css`
      background-color: #212631;
      background-image: linear-gradient(45deg, #3c4b64 0%, #212333 100%);
    `
  ]
]

export const LabelColorBox = ({ value = "", children, ...props }) => {
  let variantStyle = head(matchSorter(paris, value, { keys: [([key]) => key] }))
  return (
    <CustomStatusLabel
      css={css`
        ${variantStyle};
      `}
      {...props}
    >
      {children}
    </CustomStatusLabel>
  )
}
