import styled from "@emotion/styled"
import { css } from "@emotion/react"
export const CustomInputSearch = styled.div`
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
`

export const RemoveBoxShadowInputButton = styled.div`
  input {
    &:focus {
      box-shadow: none !important;
    }
  }
  button {
    &:focus {
      border: 1px solid #d9d9e1;
      border-left: none;
      box-shadow: none !important;
    }
  }
`

export const RemoveBoxShadowInputButtonDateTime = styled.div`
  input {
    &:focus {
      box-shadow: none !important;
    }
  }
  button {
    &:focus {
      border: 1px solid #d9d9e1;
      box-shadow: none !important;
    }
  }
  .bb-DropdownMenu {
    button {
      border-right: none !important;
    }
  }
`

export const cssCustomInputReport = css`
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
