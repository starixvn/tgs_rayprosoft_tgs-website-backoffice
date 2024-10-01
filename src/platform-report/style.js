import { css } from "@emotion/react"
import styled from "@emotion/styled"
export const CustomInputReport = css`
  .bb-InputFieldGroup,
  .react-datepicker-wrapper {
    input {
      border: 1px solid #dbdfe6;
      &:focus {
        box-shadow: none !important;
      }
    }
    button {
      &:focus,
      &:hover,
      &:active {
        box-shadow: none !important;
        border: 1px solid #dbdfe6;
        border-left: none;
        background: #fff;
      }
    }
  }
`

export const cssTableLineBg = css`
  .bb-Table {
    overflow-x: auto !important;
    .bb-TableBody {
      &:nth-child(odd) {
        background: none;
        box-shadow: inset 0 0 0 9999px #0000000d;
      }
    }
  }
`

export const GroupSearchBarButton = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
