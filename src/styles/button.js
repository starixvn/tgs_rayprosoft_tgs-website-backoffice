import styled from "@emotion/styled"

export const ActionTableButton = styled.div`
  flex-wrap: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  button {
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

export const ModalButtonPlatForm = styled.div`
  > button {
    padding: 10px 12px;
    height: 38px;
    min-height: 38px;
    &:focus {
      box-shadow: none !important;
      border: 1px solid #d9d9e1;
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
      box-shadow: none !important;
    }
    &:hover {
      &:active {
        background: #4b49b6;
      }
    }
  }
`

export const CustomBadgeButton = styled.div`
  > button {
    font-size: 0.75em;
    font-weight: 700;
    padding: 1px 4px;
    min-height: auto;
    color: #fff;
    &:focus {
      box-shadow: none !important;
    }
  }
`

export const CustomBadgeLabel = styled.div`
  .bb-Badge {
    font-size: 0.75em;
    font-weight: 700;
    padding: 2px 4px;
    border-radius: 4px;
    color: #fff;
    display: inline;
  }
`
