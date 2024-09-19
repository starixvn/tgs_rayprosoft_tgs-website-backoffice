import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { useTrans, Trans } from "../i18n"
import { SubmitTrans } from "../trans/Action"

export const SubmitButton = ({ type = "submit", children, ...props }) => (
  <Button
    type={type}
    {...props}
    boxShadow="none"
    css={css`
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
    `}
  >
    {children ?? <SubmitTrans />}
  </Button>
)

export default SubmitButton
