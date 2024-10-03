import { css } from "@emotion/react"

export const cssRemoveBorderGroupInput = css`
  input {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    &:focus {
      box-shadow: none !important;
    }
  }
`

export const cssButtonInputClose = css`
  background: #f7f7fa;
  margin: 0;
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border: 1px solid #d9d9e1;
  border-left: none;
  width: 42px;
  height: 44px;
  margin-left: 0 !important;
  &:focus {
    box-shadow: none !important;
    border: 1px solid #d9d9e1;
    border-left: none;
  }
`

export const cssDateTimeRangeInputCloseButton = css`
  input {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    &:focus {
      box-shadow: none !important;
    }
  }
  .react-datepicker-wrapper {
    min-width: 217px;
  }
`
export const cssMinWidthSelect = css`
  &.bb-SelectWrapper,
  &.bb-FieldWrapper,
  select,
  .bb-SelectWrapper,
  .bb-Group,
  .bb-Select {
    min-width: 180px;
  }
`

export const cssFlexBox = css`
  width: 100%;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`
