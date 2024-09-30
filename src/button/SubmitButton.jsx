import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { useTrans, Trans } from "../i18n"
import { SubmitTrans } from "../trans/Action"
import { SearchAndSubmitButton } from "../styles/button"

export const SubmitButton = ({ type = "submit", children, ...props }) => (
  <SearchAndSubmitButton>
    <Button type={type} {...props} boxShadow="none">
      {children ?? <SubmitTrans />}
    </Button>
  </SearchAndSubmitButton>
)

export default SubmitButton
