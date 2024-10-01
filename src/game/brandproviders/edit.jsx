import React, { useState, useEffect, useMemo } from "react"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import {
  css,
  Stack,
  Heading,
  Box,
  Button,
  Text,
  useModalState,
  Set,
  Flex
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update as UpdateMenu } from "./menu"
import { EditDisclosure } from "../../dialog/Disclosure"
import { useUpdateBrandGameProvider } from "./client"
import { Trans, useTrans } from "../../i18n"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { WeekDaySelect } from "../../date/week"
import { formatHourMinute } from "../../date/format"
import { TimeSelectField } from "../../date/TimeSelect"
import FormDialog from "../../form/FormDialog"
import { parseISO } from "date-fns"
import { MaintenanceStatusToggleButton } from "./ScheduleStatus"
import { StatusTrans } from "../../trans/Status"
import { useEditTrans } from "../../trans/Action"
import {
  BasicInformationTrans,
  PeriodicMaintenanceTrans,
  VendorTrans
} from "../../trans/Field"
import { EndTimeTrans, StartTimeTrans, WeeklyTrans } from "../../trans/Date"
import { SWRConfig } from "swr"
import { WrapperModal } from "../../styles/wrapper"

export const EditButton = ({ record, onSubmitted, ...props }) => {
  let dialog = useModalState()
  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure
        {...dialog}
        css={css`
          margin-bottom: 0 !important;
        `}
      />
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <EditDialog
            record={record}
            onSubmitted={onSubmitted}
            dialog={dialog}
          />
        </SWRConfig>
      )}
    </>
  )
}

const EditDialog = ({ record, dialog, ...props }) => {
  let [submitData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useUpdateBrandGameProvider(record?.id, submitData)

  const onSubmit = (formData) => {
    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  let title = useEditTrans()

  let from = formatHourMinute(parseISO(record.from))
  let to = formatHourMinute(parseISO(record.to))

  return (
    <FormDialog
      defaultValues={{
        ...record,
        from,
        to
      }}
      onSubmit={onSubmit}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        props?.onSubmitted()
      }}
      title={title}
      showCloseButton
      dialog={dialog}
    >
      <EditBody record={record} />
    </FormDialog>
  )
}

const EditBody = ({ record = {} }) => {
  let { gameProviderName } = record
  let { control } = useFormContext()

  const FromFieldName = "from"
  let from = useWatch({
    control,
    name: FromFieldName
  })

  const ToFieldName = "to"
  let to = useWatch({
    control,
    name: ToFieldName
  })

  return (
    <WrapperModal>
      <Stack orientation="vertical" width="500px">
        <Heading use="h5">
          <BasicInformationTrans />
        </Heading>
        <FieldValues>
          <Label>
            <VendorTrans />
          </Label>
          <ValueBlock>{gameProviderName}</ValueBlock>
        </FieldValues>

        <Heading use="h5">
          <PeriodicMaintenanceTrans />
        </Heading>
        <FieldValues
          css={css`
            gap: 16px 24px;
          `}
        >
          <Label>
            <StatusTrans />
          </Label>
          <Box>
            <MaintenanceStatusToggleButton name="scheduleStatus" required />
          </Box>

          <Label>
            <WeeklyTrans />
          </Label>
          <Box>
            <WeekDaySelect
              name="dayOfWeek"
              required
              css={css`
                width: 100%;
              `}
            />
          </Box>

          <Label>
            <StartTimeTrans />
          </Label>
          <Box>
            <TimeSelectField
              name={FromFieldName}
              required
              max={to}
              css={css`
                .bb-Group {
                  width: 100%;
                  .bb-SelectWrapper {
                    width: 100%;
                  }
                }
              `}
            />
          </Box>

          <Label marginRight="major-2">
            <EndTimeTrans />
          </Label>
          <Box>
            <TimeSelectField
              name={ToFieldName}
              required
              min={from}
              css={css`
                .bb-Group {
                  width: 100%;
                  .bb-SelectWrapper {
                    width: 100%;
                  }
                }
              `}
            />
          </Box>
        </FieldValues>
      </Stack>
    </WrapperModal>
  )
}

const ValueBlock = ({ children, ...props }) => (
  <Text.Block alignY="center" {...props}>
    {children}
  </Text.Block>
)
