import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog } from "bumbag"
import Disclosure, { DetailDisclosure } from "../../dialog/Disclosure"
import { useModalState } from "../../dialog/Modal"
import { Trans, useTrans } from "../../i18n"
import GameRoundDialog from "../../game/round/GameRoundDialog"
import Backdrop from "../../dialog/Backdrop"

export const Button = ({ record, dialogId, ...props }) => {
  let dialog = useModalState()

  return (
    <>
      <DetailDisclosure
        {...dialog}
        {...props}
        palette="info"
        css={css`
          padding: 10px 12px;
          height: 38px;
          min-height: 38px;
          border: none;
          &:focus {
            box-shadow: none !important;
          }
        `}
      />
      {dialog.visible && (
        <GameRoundDialog id={dialogId} record={record} dialog={dialog} />
      )}
    </>
  )
}

export default Button
