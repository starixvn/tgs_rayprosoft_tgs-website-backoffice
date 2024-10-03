import { css } from "@emotion/react"
import { Dialog, Stack, Text, useModalState } from "bumbag"
import React, { useMemo } from "react"
import Alert from "../../dialog/Alert"
import Disclosure from "../../dialog/Disclosure"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Trans, useTrans } from "../../i18n"
import { Table } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { OperatorTrans } from "../../trans/Action"
import { TimeTrans } from "../../trans/Date"
import { DisplayConditionTrans, PaymentLimitTrans } from "../../trans/Payment"
import { StatusTrans } from "../../trans/Status"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { toPalette } from "./BrandPaymentStatus"
import { useBrandPaymentLogs } from "./client"
import { Detail } from "./condition"
import { View as ViewMenu } from "./menu"
import { cssModalHiddenFooter } from "../../styles/modal"
import { WrapperModal } from "../../styles/wrapper"

export const ViewButton = ({ record, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} palette="success">
        <Trans zh="日志" en="Logs" />
      </Disclosure>
      {dialog.visible && <LogsDialog record={record} dialog={dialog} />}
    </>
  )
}

const LogsDialog = ({ record = {}, dialog, ...props }) => {
  let title = useTrans({
    zh: "日志",
    en: "Logs"
  })

  let { data, isLoading, error } = useBrandPaymentLogs(record?.id)
  let items = data?.auditLogs
  let columns = useColumns({ items })

  if (isLoading) {
    return <LoadingBackdrop />
  }

  if (error) {
    return <Alert {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      title={title}
      placement="top"
      showCloseButton
      maxWidth="90vw"
      {...dialog}
      css={cssModalHiddenFooter}
    >
      <WrapperModal>
        <Table
          columns={columns}
          data={items}
          isLoading={isLoading}
          usePagination={false}
        />
      </WrapperModal>
    </Dialog.Modal>
  )
}

const useColumns = ({ items = [] }) => {
  let columns = [
    {
      id: "cdreatedByUsername",
      accessor: "createdByUsername",
      Header: <OperatorTrans />,
      disableSortBy: true,
      headCell: {
        textAlign: "center"
      },
      cell: {
        textAlign: "center"
      }
    },
    dateTimeColumn({
      accessor: "createdOn",
      Header: <TimeTrans />,
      disableSortBy: true
    }),
    {
      id: "channelName",
      accessor: (record) => record,
      Header: <Trans zh="通道名称" en="Channel" />,
      disableSortBy: true,
      headCell: {
        textAlign: "center"
      },
      cell: {
        textAlign: "center"
      },
      Cell: ({ value }) => (
        <Stack spacing="minor-4" alignX="center">
          <Text.Block color="textTint" whiteSpace="nowrap">
            {value?.beforeChannelName}
          </Text.Block>
          <Text.Block whiteSpace="nowrap">{value?.afterChannelName}</Text.Block>
        </Stack>
      )
    },
    {
      id: "limit",
      accessor: (record) => record,
      Header: <PaymentLimitTrans />,
      disableSortBy: true,
      headCell: {
        textAlign: "center"
      },
      cell: {
        textAlign: "center"
      },
      Cell: ({ value }) => {
        //TODO: format num?
        return (
          <Stack spacing="minor-4" alignX="center">
            <Text.Block color="textTint" whiteSpace="nowrap">
              {value.beforeTransferLimitFrom} - {value.beforeTransferLimitTo}
            </Text.Block>
            <Text.Block whiteSpace="nowrap">
              {value.afterTransferLimitFrom} - {value.afterTransferLimitTo}
            </Text.Block>
          </Stack>
        )
      }
    },
    {
      id: "status",
      accessor: (record) => record,
      Header: <StatusTrans />,
      disableSortBy: true,
      headCell: {
        textAlign: "center"
      },
      cell: {
        textAlign: "center"
      },
      Cell: ({ value }) => {
        return (
          <Stack spacing="minor-4" alignX="center">
            <Text.Block color="textTint" whiteSpace="nowrap">
              {value.beforePaymentStatus}
            </Text.Block>
            <Text.Block
              color={toPalette(value.afterPaymentStatus)}
              whiteSpace="nowrap"
            >
              {value.afterPaymentStatus}
            </Text.Block>
          </Stack>
        )
      }
    },
    {
      id: "conditions",
      accessor: (record) => record,
      Header: <DisplayConditionTrans />,
      disableSortBy: true,
      headCell: {
        textAlign: "center"
      },
      cell: {
        textAlign: "center"
      },
      Cell: ({ value }) => {
        return (
          <Stack spacing="minor-4" alignX="center">
            <Detail
              record={{
                playerListCondition: value?.beforePlayerListCondition,
                allPlayers: value?.beforeAllPlayers,
                depositedAmountMin: value?.beforeDepositedAmountMin,
                depositedAmountMax: value?.beforeDepositedAmountMax,
                depositedAmountUnlimited: value?.beforeDepositedAmountUnlimited,
                identityAuthentication: value?.beforeIdentityAuthentication,
                phoneAuthentication: value?.beforePhoneAuthentication,
                vipLevelIds: value?.beforeVipLevelIds
              }}
              color="textTint"
            />
            <Detail
              record={{
                playerListCondition: value?.afterPlayerListCondition,
                allPlayers: value?.afterAllPlayers,
                depositedAmountMin: value?.afterDepositedAmountMin,
                depositedAmountMax: value?.afterDepositedAmountMax,
                depositedAmountUnlimited: value?.afterDepositedAmountUnlimited,
                identityAuthentication: value?.afterIdentityAuthentication,
                phoneAuthentication: value?.afterPhoneAuthentication,
                vipLevelIds: value?.afterVipLevelIds
              }}
            />
          </Stack>
        )
      }
    },
    {
      accessor: "reason",
      Header: <Trans zh="变更原因" en="Reason" />,
      disableSortBy: true,
      headCell: {
        textAlign: "center"
      },
      cell: {
        textAlign: "center"
      }
    }
  ]

  return useMemo(() => columns, [JSON.stringify(items)])
}
