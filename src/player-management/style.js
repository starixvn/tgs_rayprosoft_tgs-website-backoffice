import { css } from "@emotion/react"
export const CustomInputPlayerListCss = css`
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
      }
    }
  }
  margin-bottom: 8px;
`

export const CustomInputPlayerIdCss = css`
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
  .react-datepicker-wrapper {
    min-width: unset !important;
    width: 205px !important;
    input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .bb-Label {
    margin: 5px 0 !important;
  }
  margin-bottom: 8px;
`

export const minWithSelect = css`
  min-width: 251px;
  width: 251px;
`

export const hiddenCheckBoxShadow = css`
  cursor: not-allowed;
  > input {
    &:focus + .bb-CheckboxIcon {
      box-shadow: none !important;
      border: 1px solid #d9d9e1 !important;
    }
  }
`

export const selectWrapperFull = css`
  .bb-SelectWrapper {
    width: 100%;
  }
`
export const removeBorderRadiusDropdownButton = css`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`
