import styled from "@emotion/styled"
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
`
