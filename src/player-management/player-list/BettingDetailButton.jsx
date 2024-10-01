import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog } from "bumbag"
import Disclosure, { DetailDisclosure } from "../../dialog/Disclosure"
import { useModalState } from "../../dialog/Modal"
import { Trans, useTrans } from "../../i18n"
import GameRoundDialog from "../../game/round/GameRoundDialog"
import Backdrop from "../../dialog/Backdrop"
import { ModalButtonPlatForm } from "../../styles/button"

export const Button = ({ record, dialogId, ...props }) => {
  let dialog = useModalState()

  return (
    <>
      <ModalButtonPlatForm>
        <DetailDisclosure {...dialog} {...props} palette="info" />
      </ModalButtonPlatForm>

      {dialog.visible && (
        <GameRoundDialog id={dialogId} record={record} dialog={dialog} />
      )}
    </>
  )
}

export default Button
