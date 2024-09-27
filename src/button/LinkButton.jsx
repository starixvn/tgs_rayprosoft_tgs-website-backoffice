import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button, Link } from "bumbag"
import { Trans } from "../i18n"

export const LinkButton = ({
  type = "button",
  url,
  target = "_blank",
  children,
  ...props
}) => {
  if (!url) {
    return null
  }

  return (
    <Button {...props} variant="ghost" padding="0" height="0" minHeight="0">
      <Link href={url} target={target} color="#06c">
        {children}
      </Link>
    </Button>
  )
}

export const ImageLinkButton = ({ ...props }) => (
  <LinkButton {...props}>
    <Trans zh="查看图片" en="View Image" />
  </LinkButton>
)
