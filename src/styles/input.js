import styled from "@emotion/styled"
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
