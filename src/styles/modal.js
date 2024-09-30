import styled from "@emotion/styled"
export const CustomModalXs = styled.div`
  min-width: 320px;
  max-width: 70vw;
  overflow: hidden;
  & .bb-DialogContent {
    max-height: 70vh;
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

  & .bb-DialogFooter {
    border-top: 1px solid #dbdfe6;
    padding: 0.8rem;
    background: #fff;
    > div > button {
      &:focus {
        box-shadow: none !important;
      }
    }
  }
`

export const CustomModalHiddenFooter = styled.div`
  max-width: 70vw;
  overflow: hidden;
  .bb-DialogContent {
    max-height: 70vh;
    padding: 0;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .bb-DialogHeader {
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
