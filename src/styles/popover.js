import { css } from "@emotion/react"
export const customPopover = css`
  border: 1px solid #080a0c2d;
  box-shadow: none;
  cursor: pointer;
  &:focus {
    box-shadow: none !important;
  }
  .bb-PopoverArrow {
    svg {
      .stroke {
        fill: #080a0c2d;
      }
    }
  }
`
