import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  FieldStack,
  Text,
  Box,
  Button,
  Dialog,
  Columns,
  Set,
  Card,
  Link,
  Table,
  useModalState
} from "bumbag"
import {
  useTrans,
  Trans,
  FormattedNumber,
  useLangCode,
  FormattedNumberDecimal,
  FormattedNumberDecimalPercentage
} from "../../i18n"
import { useGameRound } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import defaultFormatDateTime from "../../date/format"
import { GameRoundStatusLabel } from "./GameRoundStatus"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import MonacoEditor, { loader } from "@monaco-editor/react"
import Textarea from "../../textarea"
import formatXml from "xml-formatter"
import { stringifyJSON } from "../../text/json"
import { ConfigPaths } from "../../text/editor/MonacoEditor"
import Disclosure from "../../dialog/Disclosure"
import { Modal } from "../../dialog/Modal"
import {
  BetAmountTrans,
  BetTimeTrans,
  ExternalBetTimeTrans,
  ExternalRoundIdTrans,
  GameNameTrans,
  GameProviderTrans,
  RoundIdTrans,
  SettleTimeTrans,
  SubGameProviderTrans,
  TurnoverTrans,
  ValidBetAmountTrans,
  WinLossTrans
} from "../../trans/Game"
import { UserNameTrans } from "../../trans/User"
import { cssCustomModalXs } from "../../styles/modal"
import { WrapperModal } from "../../styles/wrapper"
import { spacingForm } from "../../styles/spacing"

loader.config({
  paths: ConfigPaths
})

export const GameRoundDialogDisclosure = ({
  id,
  dialogId,
  label,
  record,
  ...props
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props} palette="success">
        {label}
      </Disclosure>
      {dialog.visible && (
        <GameRoundDialog record={record} dialog={dialog} dialogId={dialogId} />
      )}
    </>
  )
}

export const GameRoundDialog = ({
  record = {},
  dialog,
  dialogId = "game-round-dialog",
  hideBackdrop,
  ...props
}) => {
  let { id } = record
  let language = useLangCode()

  let { isLoading, data, error } = useGameRound(id, {
    roundId: record.id,
    gameId: record.gameId,
    gameProviderCode: record.gameProviderCode,
    playerCode: record.playerCode,
    externalRoundId: record.externalRoundId,
    externalClosedOn: record.externalClosedOn,
    baseCurrency: record.currencyCode,
    language
  })

  let title = useTrans({
    zh: "订单详情",
    en: "Order Detail"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal
      id={dialogId}
      title={title}
      placement="top"
      {...dialog}
      css={cssCustomModalXs}
      {...props}
      minWidth="45vw"
    >
      <WrapperModal>
        <Set orientation="vertical" isFilled>
          <FieldValues css={spacingForm} marginBottom="20px">
            <NormalLabel whiteSpace="normal">
              <UserNameTrans />
            </NormalLabel>
            <Box alignY="center">{record.playerName}</Box>

            <NormalLabel whiteSpace="normal">
              <RoundIdTrans />
            </NormalLabel>
            <Box alignY="center">{record.id}</Box>

            <NormalLabel whiteSpace="normal">
              <BetTimeTrans />
            </NormalLabel>
            <Box alignY="center">{defaultFormatDateTime(record.createdOn)}</Box>

            <NormalLabel whiteSpace="normal">
              <SettleTimeTrans />
            </NormalLabel>
            <Box alignY="center">{defaultFormatDateTime(record.closedOn)}</Box>
          </FieldValues>
          <FieldValues css={spacingForm}>
            <NormalLabel whiteSpace="normal">
              <Trans zh="三方用户名" en="Player Code" />
            </NormalLabel>
            <Box alignY="center">{record.playerCode}</Box>

            <NormalLabel whiteSpace="normal">
              <ExternalRoundIdTrans />
            </NormalLabel>
            <Box alignY="center">{record.externalRoundId}</Box>

            <NormalLabel whiteSpace="nowrap">
              <ExternalBetTimeTrans />
            </NormalLabel>
            <Box alignY="center">
              {defaultFormatDateTime(record.externalCreatedOn)}
            </Box>

            <NormalLabel whiteSpace="nowrap">
              <Trans zh="三方结算时间" en="External Closed On" use={Box} />
            </NormalLabel>
            <Box alignY="center">
              {defaultFormatDateTime(record.externalClosedOn)}
            </Box>
          </FieldValues>
          <Box
            border="default"
            height="1px"
            width="100%"
            borderBottom="none"
            margin="20px 0"
          ></Box>
          <FieldValues css={spacingForm} marginBottom="20px">
            <NormalLabel whiteSpace="normal">
              <GameProviderTrans />
            </NormalLabel>
            <Box alignY="center">{record.gameProviderName}</Box>

            <NormalLabel whiteSpace="normal">
              <GameNameTrans />
            </NormalLabel>
            <Box alignY="center">{record.gameName}</Box>

            <NormalLabel whiteSpace="normal">
              <BetAmountTrans />
            </NormalLabel>
            <Box alignY="center">
              <FormattedNumberDecimal
                id="bet-amount"
                value={record.betAmount}
              />
            </Box>

            <NormalLabel whiteSpace="normal">
              <ValidBetAmountTrans />
            </NormalLabel>
            <Box alignY="center">
              <FormattedNumberDecimal value={record.validBetAmount} />
            </Box>

            <NormalLabel whiteSpace="normal">
              <TurnoverTrans />
            </NormalLabel>
            <Box alignY="center">
              <FormattedNumberDecimal value={record.originalTurnover} />
            </Box>

            <NormalLabel whiteSpace="normal">
              <Trans zh="流水比例" en="Turnover Percentage" />
            </NormalLabel>
            <Box alignY="center">
              <FormattedNumberDecimalPercentage
                value={record.effectiveBettingPercentage}
              />
            </Box>

            <NormalLabel whiteSpace="normal">
              <WinLossTrans />
            </NormalLabel>
            <Box alignY="center">
              <FormattedNumberDecimal value={record.winLoss} />
            </Box>

            <NormalLabel whiteSpace="normal">
              <Trans zh="订单状态" en="Status" />
            </NormalLabel>
            <Box alignY="center">
              <GameRoundStatusLabel value={record.status} />
            </Box>

            <NormalLabel whiteSpace="normal">
              <Trans zh="开奖结果" en="Game Result" />
            </NormalLabel>
            <Box alignY="center">{data.gameResult}</Box>
          </FieldValues>
          <FieldValues css={spacingForm} marginBottom="20px">
            <NormalLabel whiteSpace="normal">
              <SubGameProviderTrans />
            </NormalLabel>
            <Box alignY="center">{record.subGameProviderName}</Box>

            <NormalLabel whiteSpace="normal">
              <Trans zh="游戏局号" en="ID" />
            </NormalLabel>
            <Box alignY="center">{record.id}</Box>

            <NormalLabel whiteSpace="normal">
              <ValidBetAmountTrans />
            </NormalLabel>
            <Box alignY="center">
              <FormattedNumberDecimal value={record.validBetAmount} />
            </Box>
            {/* <EmptyPlaceholderField />
            <EmptyPlaceholderValue />

            <EmptyPlaceholderField />
            <EmptyPlaceholderValue /> */}
          </FieldValues>

          <GameRoundDataCard value={data?.data} />
        </Set>
      </WrapperModal>
    </Modal>
  )
}

const EmptyPlaceholderField = () => (
  <NormalLabel visibility="hidden">
    <Trans zh="Placeholder" en="Placeholder" />
  </NormalLabel>
)

const EmptyPlaceholderValue = () => (
  <Text.Block visibility="hidden"></Text.Block>
)

const GameRoundDataCard = ({ value: items = [], ...props }) => {
  return (
    <Card title={<Trans zh="开奖结果" en="Result" />} variant="bordered">
      <Set orientation="vertical" isFilled>
        {items.map((item, index) => (
          <GameRoundDataContent key={index} value={item} />
        ))}
      </Set>
    </Card>
  )
}

//TODO: sync with backend
const ContentType = {
  Url: "Url", //1,
  Table: "Table", //2,
  Text: "Text", //3,
  Json: "Json", //4,
  Xml: "Xml", //5
  Iframe: "Iframe"
}
const GameRoundDataContent = ({
  value: { type = "", ...record } = {},
  ...props
}) => {
  console.warn("TODO: GameRoundDataContent type:", type, "record: ", record)
  switch (type) {
    case ContentType.Url:
      return <UrlContent {...record} />

    case ContentType.Json:
      return <JsonContent {...record} />

    case ContentType.Table:
      return <TableContent {...record} />

    case ContentType.Text:
      return <Textarea value={record?.value ?? ""} />

    case ContentType.Iframe:
      return <IframeContent {...record} />

    case ContentType.Xml:
      return <XmlContent {...record} />
    default:
      return null
  }
}

const UrlContent = ({ url = "" }) => {
  return (
    <Link.Block href={url} target="_blank">
      {url}
    </Link.Block>
  )
}

const IframeContent = ({ value = "" }) => {
  if (!value?.length) {
    return null
  }

  return <iframe src={value} width="100%" height="550px"></iframe>
}

const JsonContent = ({ value = "" }) => {
  if (!value) {
    return null
  }

  let formattedValue = stringifyJSON(value)
  return (
    <MonacoEditor
      defaultLanguage="JSON"
      height="30vh"
      value={formattedValue}
      options={{
        readOnly: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        contextmenu: false,
        hideCursorInOverviewRuler: true
      }}
      css={css`
        border: 1px solid var(--bb-palette-white900, #000000);
        border-radius: 6px;
      `}
    />
  )
}

const XmlContent = ({ value = "", ...props }) => {
  let formattedValue = formatXml(value)
  return (
    <MonacoEditor
      defaultLanguage="XML"
      height="30vh"
      value={formattedValue}
      options={{
        readOnly: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        contextmenu: false,
        hideCursorInOverviewRuler: true
      }}
      css={css`
        border: 1px solid var(--bb-palette-white900, #000000);
        border-radius: 6px;
      `}
    />
  )
}

const TableContent = ({ headers = [], rows = [], ...props }) => {
  if (rows.length === 0) {
    return null
  }

  return (
    <Table>
      {headers.length && (
        <Table.Head>
          <Table.Row>
            {headers.map((header) => (
              <ContentHeader value={header} />
            ))}
          </Table.Row>
        </Table.Head>
      )}
      <Table.Body>
        {rows.map((row) => (
          <ContentRow headers={headers} value={row} />
        ))}
      </Table.Body>
    </Table>
  )
}

const ContentHeader = ({ value = "" }) => (
  <Table.HeadCell>{value}</Table.HeadCell>
)

const ContentRow = ({ value: record, headers = [] }) => {
  return (
    <Table.Row>
      {headers.map((header) => {
        let value = Reflect.get(record, header)
        return <Table.Cell>{value}</Table.Cell>
      })}
    </Table.Row>
  )
}

export default GameRoundDialog
