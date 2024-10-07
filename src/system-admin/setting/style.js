import { css } from "@emotion/react"
export const cssCustomModalComponent = css`
  min-width: 320px;
  max-width: 75vw;
  overflow: hidden;
  & .bb-DialogContent {
    max-height: 90vh;
    padding: 0;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  & .bb-DialogHeader {
    padding: 1rem;
    border-bottom: 1px solid #dbdfe6;
    margin-bottom: 0;
    position: fixed;
    width: 100%;
    z-index: 9999;
    background: #fff;
    border-radius: 6px 6px 0 0;
    > button {
      box-shadow: none !important;
      background: none !important;
    }
  }
`
