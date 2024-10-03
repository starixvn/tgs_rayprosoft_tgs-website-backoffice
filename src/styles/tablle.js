import styled from "@emotion/styled"
import { css } from "@emotion/react"
export const CustomTableStyle = styled.div`
  table {
    > tbody {
      tr {
        &:not(:last-child) {
          border-bottom: 1px solid #dbdfe6 !important;
        }
        &:nth-child(odd) {
          background: none;
          box-shadow: inset 0 0 0 9999px #0000000d;
        }
      }
    }
  }
  .bb-Pagination {
    > button {
      &:focus,
      &:hover,
      &:active {
        border: none !important;
        box-shadow: none !important;
        background: none !important;
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
    max-height: 80vh !important;
    border-collapse: separate !important;
    .bb-TableHeadCell {
      border-bottom: 1px solid #e6e6eb;
      white-space: nowrap !important;
    }
    .bb-TableBody {
      &:nth-child(odd) {
        background: none;
        box-shadow: inset 0 0 0 9999px #0000000d;
      }
    }
  }
`
