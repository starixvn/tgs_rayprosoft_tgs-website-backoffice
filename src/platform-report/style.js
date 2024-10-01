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
  #date-range-dropdown-menu {
    button {
      border-right: none;
      &:focus,
      &:hover,
      &:active {
        box-shadow: none !important;
        border: 1px solid #dbdfe6;
        border-right: none;
        background: #fff;
      }
    }
  }
`

export const cssTableLineBg = css`
  .custom-width-table {
    border: 1px solid #e6e6eb;
  }
  .bb-Table {
    border: none !important;
    overflow-x: auto !important;
    max-height: 80vh;
    border-collapse: separate !important;
    .bb-TableHeadCell {
      border-bottom: 1px solid #e6e6eb;
    }
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

export const CustomSpacingMerchantBar = styled.div`
  #page-merchant-bar {
    margin: 24px 24px -24px;
  }
`
