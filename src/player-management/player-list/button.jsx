import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, Dialog, useModalState } from "bumbag"
import { View as ViewMenu, Update as UpdateMenu, Contact, Bank } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import {
  PlayerInfoTab,
  PlayerInfoPanel,
  PlayerInfoEditPanel,
  PlayerInfoKey
} from "./PlayerInfo.jsx"
import {
  Tab as ContractTab,
  Panel as ContractPanel,
  EditPanel as ContractEditPanel
} from "./contact"
import { Tab as BankTab, Panel as BankPanel } from "./bank"
import { Tab as BettingTab, Panel as BettingPanel } from "./betting"
import { Tab as PasswordTab, Panel as PasswordPanel } from "./password"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { usePlayer, usePlayerBucketAmount, usePlayerPayment } from "./client"
import {
  Trans,
  FormattedDateTime,
  FormattedNumber,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import Disclosure, {
  ViewDisclosure,
  EditDisclosure
} from "../../dialog/Disclosure"
import { Tabs, TabList, useTabState } from "../../tab"
import {
  PlayerBalanceChangePanel,
  PlayerBalanceChangeTab
} from "./PlayerBalanceChange"
import { PlayerPromotionPanel, PlayerPromotionTab } from "./PlayerPromotion.jsx"
import { isDev } from "../../env"
import {
  PlayerVipChangeListPanel,
  PlayerVipChangeListTab
} from "./PlayerVipChangeList"
import {
  PlayerHistoryListPanel,
  PlayerHistoryListTab
} from "./PlayerHistoryList"
import { SWRConfig } from "swr"

export const ViewButton = ({
  player,
  brandId,
  brand,
  showParentUsername,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <TabsDialog
          id="view-player-dialog"
          playerCode={player.playerCode}
          brandId={brandId}
          brand={brand}
          dialog={dialog}
          showParentUsername={showParentUsername}
          // css={css`
          //   & .bb-TabsPanel {
          //     min-height: 75vh;
          //   }
          // `}
        />
      )}
    </>
  )
}

export const EditButton = ({
  brandId,
  brand,
  player,
  showParentUsername,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <TabsDialog
            id="edit-player-dialog"
            edit={true}
            brandId={brandId}
            brand={brand}
            playerCode={player.playerCode}
            showParentUsername={showParentUsername}
            onSubmitted={onSubmitted}
            dialog={dialog}
          />
        </SWRConfig>
      )}
    </>
  )
}

const TabsDialog = ({
  playerCode,
  brandId,
  brand,
  edit = false,
  dialog,
  onSubmitted,
  showParentUsername,
  ...props
}) => {
  const readonly = !edit
  let tab = useTabState({
    selectedId: PlayerInfoKey
  })

  let title = useTrans({
    zh: "玩家详情",
    en: "Player info",
    vi: "Chi tiết người chơi"
  })

  const {
    data,
    isLoading: isLoadingPlayer,
    error: playerError,
    mutate
  } = usePlayer(playerCode)

  const {
    data: wageringRequirement,
    isLoading: isLoadingWageringRequirement,
    error: wageringRequirementError
  } = usePlayerBucketAmount(playerCode)

  let {
    data: playerPayment,
    isLoading: isLoadingPlayerPayment,
    error: playerPaymentError
  } = usePlayerPayment(playerCode)

  let isLoading =
    isLoadingPlayer || isLoadingWageringRequirement || isLoadingPlayerPayment
  let error = playerError || wageringRequirementError || playerPaymentError
  let player = { ...data, wageringRequirement, playerPayment }

  const onClickClose = dialog.hide

  return (
    <>
      {isLoading && <LoadingBackdrop {...dialog} />}
      {error && <AlertDialog {...error} onClickClose={onClickClose} />}
      {data && (
        <Dialog.Modal
          title={title}
          hideOnClickOutside={false}
          showCloseButton={true}
          placement="top"
          {...dialog}
          {...props}
          css={css`
            min-width: ${readonly ? "85vw" : "65vw"};
            min-height: 75vh;
            & .bb-DialogContent {
              max-height: 75vh;
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
          `}
        >
          <Box padding="5rem 1rem 1rem 1rem">
            {readonly && (
              <ViewTabs
                playerCode={playerCode}
                brandId={brandId}
                brand={brand}
                player={player}
                showParentUsername={showParentUsername}
                tab={tab}
              />
            )}
            {edit && (
              <EditTabs
                playerCode={playerCode}
                brandId={brandId}
                brand={brand}
                player={player}
                showParentUsername={showParentUsername}
                tab={tab}
                onSubmitted={() => {
                  onSubmitted?.()
                  dialog.hide()
                  mutate()
                }}
                onClickClose={onClickClose}
              />
            )}
          </Box>
        </Dialog.Modal>
      )}
    </>
  )
}

const ViewTabs = ({
  playerCode,
  brandId,
  brand,
  showParentUsername,
  player,
  tab
}) => {
  let contactAuth = useIsDisplayMenuByRoute([Contact])

  return (
    <Tabs>
      <TabList
        use={TabList}
        {...tab}
        css={css`
          > button {
            box-shadow: none !important;
            border-bottom: 2px solid transparent;
            &:hover {
              box-shadow: none !important;
              border-bottom: 2px solid #574feb;
            }
          }
          > button[aria-selected="true"] {
            border-bottom: 2px solid #574feb !important;
          }
        `}
      >
        <PlayerInfoTab {...tab} />
        {contactAuth && <ContractTab {...tab} />}
        <BankTab {...tab} />
        <BettingTab {...tab} />
        <PlayerHistoryListTab {...tab} />
        <PlayerBalanceChangeTab {...tab} />
        <PlayerPromotionTab {...tab} />
        <PlayerVipChangeListTab {...tab} />
      </TabList>
      <PlayerInfoPanel
        player={player}
        brand={brand}
        showParentUsername={showParentUsername}
        {...tab}
      />
      {contactAuth && <ContractPanel player={player} {...tab} />}
      <BankPanel playerCode={playerCode} banks={player.banks} {...tab} />
      <BettingPanel
        playerCode={playerCode}
        player={player}
        brandId={brandId}
        {...tab}
      />
      <PlayerHistoryListPanel
        playerCode={playerCode}
        brandId={brandId}
        {...tab}
      />
      <PlayerBalanceChangePanel
        playerCode={playerCode}
        brandId={brandId}
        {...tab}
      />
      <PlayerPromotionPanel
        playerCode={playerCode}
        brandId={brandId}
        {...tab}
      />
      <PlayerVipChangeListPanel
        playerCode={playerCode}
        brandId={brandId}
        {...tab}
      />
    </Tabs>
  )
}

const EditTabs = ({
  brandId,
  brand,
  playerCode,
  player,
  showParentUsername,
  tab,
  onSubmitted,
  onClickClose
}) => {
  let contactAuth = useIsDisplayMenuByRoute([Contact])
  let bankAuth = useIsDisplayMenuByRoute([Bank])
  return (
    <Tabs>
      <TabList
        use={TabList}
        {...tab}
        css={css`
          > button {
            box-shadow: none !important;
            border-bottom: 2px solid transparent;
            &:hover {
              box-shadow: none !important;
              border-bottom: 2px solid #574feb;
            }
          }
          > button[aria-selected="true"] {
            border-bottom: 2px solid #574feb !important;
          }
        `}
      >
        <PlayerInfoTab {...tab} />
        {contactAuth && <ContractTab {...tab} />}
        {bankAuth && <BankTab {...tab} />}
        <PasswordTab {...tab} />
      </TabList>
      <PlayerInfoEditPanel
        player={player}
        showParentUsername={showParentUsername}
        brandId={brandId}
        brand={brand}
        playerCode={playerCode}
        onSubmitted={onSubmitted}
        onClickClose={onClickClose}
        {...tab}
      />
      {contactAuth && (
        <ContractEditPanel
          player={player}
          playerCode={playerCode}
          onSubmitted={onSubmitted}
          onClickClose={onClickClose}
          {...tab}
        />
      )}
      {bankAuth && (
        <BankPanel
          brandId={brandId}
          playerCode={playerCode}
          banks={player.banks}
          edit={true}
          {...tab}
        />
      )}
      <PasswordPanel
        playerCode={playerCode}
        onSubmitted={onSubmitted}
        onClickClose={onClickClose}
        {...tab}
      />
    </Tabs>
  )
}
