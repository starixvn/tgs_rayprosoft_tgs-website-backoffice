import { css } from "@emotion/react"

export const cssWrapper = css`
  width: 400px;
  border: 1px solid #d9d9e1;
  border-radius: 5px;
  padding: 20px 2.5rem 2.5rem;
  background: #ffffff;
  @media screen and (max-width: 576px) {
    width: 95%;
  }
`

export const cssCardPadding = css`
  padding: 0;
  background: none;
`

export const cssWrapperInput = css`
  border: 1px solid #d9d9e1;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 16px !important;
  display: flex;
`

export const cssWrapperIcon = css`
  padding: 0.375rem 0.75rem;
  background-color: #f3f4f7;
  border-right: 1px solid #dbdfe6;
  display: flex;
  align-items: center;
`

export const cssInputName = css`
  width: 100%;
  > input {
    border: none !important;
    height: 38px;
    border-radius: 0 !important;
  }
`

export const cssInputPassWord = css`
  width: 100%;
  > div {
    width: 100%;
    input {
      border: none !important;
      height: 38px;
      width: 100%;
      border-radius: 0 !important;
    }
  }
`
