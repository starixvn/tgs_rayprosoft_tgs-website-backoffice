import styled from "@emotion/styled"
export const CustomNavTab = styled.div`
  .bb-TabsPanel {
    background: #fff;
  }
  .bb-TabsList {
    button {
      box-shadow: none !important;
      border-bottom: 2px solid transparent;
      &:hover {
        box-shadow: none !important;
        border-bottom: 2px solid #574feb;
      }
    }
    button[aria-selected="true"] {
      border-bottom: 2px solid #574feb !important;
    }
  }
`

export const CustomNavTabSecond = styled.div`
  .bb-TabsPanel {
    background: #fff;
    padding: 1rem !important;
  }
  .bb-TabsList {
    .bb-TabsTab {
      box-shadow: none !important;
      border-bottom: 2px solid transparent;
      &:hover {
        box-shadow: none !important;
        border-bottom: 2px solid #574feb;
      }
    }
  }
  .bb-TabsList {
    .bb-TabsTab[aria-selected="true"] {
      border-bottom: 2px solid #574feb !important;
    }
  }
`
