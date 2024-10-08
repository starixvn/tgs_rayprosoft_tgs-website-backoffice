import { css } from "@emotion/react"

export const cssCustomToolTip = css`
  .tooltip-container {
    position: relative;
    display: inline-block;
    .tooltip {
      opacity: 0;
      color: #080a0c;
      background: #fff;
      padding: 0.5rem 0.75rem;
      border: 1px solid rgba(8, 10, 12, 0.176);
      text-align: center;
      position: absolute;
      border-radius: 6px;
      word-break: break-all;
      width: 100%;
      z-index: 9999;
      &:after {
        content: "";
        background: #fff;
        border: 1px solid rgba(8, 10, 12, 0.176);
        height: 15px;
        position: absolute;
        width: 15px;
      }
      &-top {
        left: 0;
        bottom: 100%;
        margin-bottom: 10px;
      }
      &-top:after {
        left: 45%;
        top: 100%;
        border-right: 0;
        border-bottom: 0;
        transform: translate(50%, -50%) rotate(223deg);
      }
      &-bottom {
        left: 0;
        top: 100%;
        margin-top: 10px;
      }
      &-bottom:after {
        right: 50%;
        top: -1px;
        border-right: 0;
        border-bottom: 0;
        transform: translate(50%, -50%) rotate(45deg);
      }
      &-right {
        transform: translate(0, -55%);
        left: 100%;
        margin-left: 10px;
      }
      &-right:after {
        top: 50%;
        left: -16px;
        border-right: 0;
        border-bottom: 0;
        transform: translate(50%, -50%) rotate(-45deg);
      }
      &-left {
        top: 50%;
        transform: translate(0, -50%);
        left: -100%;
        margin-right: 10px;
      }
      &-left:after {
        bottom: 40%;
        right: 0;
        border-right: 0;
        border-bottom: 0;
        transform: translate(50%, -50%) rotate(135deg);
      }
    }
    &:hover {
      .tooltip {
        opacity: 1;
      }
    }
  }
`
