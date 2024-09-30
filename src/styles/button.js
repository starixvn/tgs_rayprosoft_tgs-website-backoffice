import styled from "@emotion/styled"

export const ActionTableButton = styled.div`
  flex-wrap: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  > button {
    padding: 10px 12px;
    height: 38px;
    min-height: 38px;
    border: none;
    &:focus {
      box-shadow: none !important;
      border: none !important;
    }
  }
`

export const SearchAndSubmitButton = styled.div`
  > button {
    background: #4b49b6;
    color: #fff;
    border-radius: 6px !important;
    border: 1px solid !important;
    font-weight: 400;
    &:focus,
    &:hover,
    &:active {
      background: #4b49b6;
    }
    &:hover {
      &:active {
        background: #4b49b6;
      }
    }
  }
`
