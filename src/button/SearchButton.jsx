import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { useTrans, Trans } from "../i18n"
import { SearchTrans } from "../trans/Action"
import { SearchAndSubmitButton } from "../styles/button"

export const SearchButton = ({ type = "submit", children, ...props }) => (
  <SearchAndSubmitButton>
    <Button type={type} {...props} boxShadow="none">
      {children ?? <SearchTrans />}
    </Button>
  </SearchAndSubmitButton>
)

export default SearchButton
