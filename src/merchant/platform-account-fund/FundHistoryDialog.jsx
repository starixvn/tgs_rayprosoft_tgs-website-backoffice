import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Icon,
  FieldStack,
  Text,
  Set,
  List,
  Box,
  Alert,
  Columns,
  Stack,
  Link
} from "bumbag"
import {
  FormattedDate,
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import Disclosure from "../../dialog/Disclosure"
import Modal from "../../dialog/Modal"
import { usePlatformAccountFundColumns } from "./index"
import { usePlatformAccountFundHistory } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { WrapperModal } from "../../styles/wrapper"

const usePlatformAccountFundHistoryTrans = () =>
  useTrans({
    zh: "歷史記錄",
    en: "Fund Performance"
  })

export const FundHistoryDialogDisclosure = ({
  brandId,
  id,
  dialogId = "fund-history-dialog"
}) => {
  let dialog = useModalState()

  let label = usePlatformAccountFundHistoryTrans()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        {label}
      </Disclosure>
      {dialog.visible && (
        <HistoryDialog
          brandId={brandId}
          dialog={dialog}
          dialogId={dialogId}
          title={label}
        />
      )}
    </>
  )
}

const HistoryDialog = ({ brandId, dialog, dialogId, title }) => {
  let { isLoading, data: items, error } = usePlatformAccountFundHistory(brandId)

  let { state, setPageIndex, setSortOrder } = useTable()

  let columns = usePlatformAccountFundColumns({
    brandId,
    items
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
      {...dialog}
      css={css`
        min-width: 75vw;
        & .bb-DialogContent {
          max-height: 70vh;
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
      <WrapperModal>
        <Table
          columns={columns}
          data={items}
          controlledState={state}
          autoPaging={true}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
          hasCellDividers
          css={css`
            > tbody {
              tr {
                background: #fff;
                &:not(:last-child) {
                  border-bottom: 1px solid #dbdfe6 !important;
                }
              }
            }
          `}
        />
      </WrapperModal>
    </Modal>
  )
}
