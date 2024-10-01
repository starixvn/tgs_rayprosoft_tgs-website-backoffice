import React, { useState, useEffect, useMemo } from "react"
import {
  css,
  Stack,
  Heading,
  Box,
  Button,
  Group,
  Set,
  Table,
  DropdownMenu,
  useModalState
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update as UpdateMenu } from "./menu"
import { Disclosure } from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import {
  useUpdateBrandGameProviderPresetMaintenance,
  useBrandGameProviderPresetMaintenanceList
} from "./client"
import FormDialog from "../../form/FormDialog"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import DateTimeInput from "../../date/DateTimeInput"
import cloneDeep from "clone-deep"
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext
} from "react-hook-form"
import format from "../../date/format"
import { ScheduleStatus, ScheduleStatusLabel } from "./ScheduleStatus"
import { ActionTrans, AddTrans } from "../../trans/Action"
import { StatusTrans } from "../../trans/Status"
import {
  PresetMaintenanceTrans,
  usePresetMaintenanceTrans
} from "../../trans/Game"
import { EndTimeTrans, StartTimeTrans } from "../../trans/Date"
import { SWRConfig } from "swr"
import { WrapperModal } from "../../styles/wrapper"
import { ActionTableButton } from "../../styles/button"

export const EditPresetButton = ({ record, onSubmitted, ...props }) => {
  let dialog = useModalState()
  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} palette="secondary">
        <PresetMaintenanceTrans />
      </Disclosure>
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
  let { id } = record
  let {
    items,
    isLoading: isLoadingPresetMaintenance,
    error: presetMaintenanceError,
    deleteCache
  } = useBrandGameProviderPresetMaintenanceList(id)

  let [defaultTimes, setDefaultTimes] = useState([])

  const add = (record) => {
    setDefaultTimes((list) => [...list, record])
  }

  const deletePresetMaintenance = (index) => {
    setDefaultTimes((list) => {
      list.splice(index, 1)
      return [...list]
    })
  }

  const setScheduleStatus = (scheduleStatus) => {
    setDefaultTimes((list) =>
      list.map((item) => ({
        ...item,
        scheduleStatus
      }))
    )
  }

  useEffect(() => {
    if (items?.length) {
      setDefaultTimes(cloneDeep(items))
    }
  }, [items])

  let [submitData, setSubmit] = useState()
  let { result, isLoading, error, mutate } =
    useUpdateBrandGameProviderPresetMaintenance(record?.id, submitData)

  const onSubmit = (formData) => {
    setSubmit({ defaultTimes, scheduleStatus: formData.scheduleStatus })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  let title = usePresetMaintenanceTrans()

  if (isLoadingPresetMaintenance) {
    return <LoadingBackdrop {...dialog} />
  }

  if (presetMaintenanceError) {
    return (
      <AlertDialog {...presetMaintenanceError} onClickClose={dialog.hide} />
    )
  }

  return (
    <FormDialog
      defaultValues={{
        scheduleStatus: "",
        from: null,
        to: null
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
      placement="top"
      minWidth="60vw"
    >
      <EditBody
        setScheduleStatus={setScheduleStatus}
        items={defaultTimes}
        add={add}
        deletePresetMaintenance={deletePresetMaintenance}
      />
    </FormDialog>
  )
}

const EditBody = ({
  items,
  add,
  deletePresetMaintenance,
  setScheduleStatus
}) => {
  return (
    <WrapperModal>
      <Stack minHeight="50vh">
        <Stack orientation="horizontal" marginBottom="0">
          <AddPresetMaintenance add={add} />
          <ScheduleStatusDropdownMenu
            items={items}
            setScheduleStatus={setScheduleStatus}
          />
        </Stack>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.HeadCell textAlign="center">
                <StartTimeTrans />
              </Table.HeadCell>
              <Table.HeadCell textAlign="center">
                <EndTimeTrans />
              </Table.HeadCell>
              <Table.HeadCell textAlign="center">
                <ActionTrans />
              </Table.HeadCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {items.map((item, index, list) => (
              <PresetMaintenanceRow
                key={index}
                {...item}
                index={index}
                deletePresetMaintenance={deletePresetMaintenance}
              />
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </WrapperModal>
  )
}

const PresetMaintenanceRow = ({
  from,
  to,
  scheduleStatus,
  index,
  deletePresetMaintenance
}) => {
  return (
    <Table.Row>
      <Table.Cell textAlign="center">{format(from)}</Table.Cell>
      <Table.Cell textAlign="center">{format(to)}</Table.Cell>
      <Table.Cell textAlign="center">
        <ActionTableButton
          css={css`
            justify-content: center;
          `}
        >
          <Button
            palette="danger"
            onClick={() => {
              deletePresetMaintenance(index)
            }}
            visibility={
              scheduleStatus === ScheduleStatus.Enabled ? "visible" : "hidden"
            }
          >
            <Trans zh="删除" en="Delete" />
          </Button>
        </ActionTableButton>
      </Table.Cell>
    </Table.Row>
  )
}

const AddPresetMaintenance = ({ add }) => {
  let {
    watch,
    formState: { errors },
    setValue
  } = useFormContext()
  let from = watch("from")
  let minDate = watch("from")

  let to = watch("to")
  let maxDate = watch("to")
  let scheduleStatus = watch("scheduleStatus")
  return (
    <Set
      orientation="horizontal"
      marginBottom="major-1"
      marginRight="0"
      minWidth="812px"
    >
      <Group>
        <Button isStatic minWidth="150px">
          <StartTimeTrans />
        </Button>
        <DateTimeInput name="from" maxDate={maxDate} />
      </Group>

      <Group>
        <Button isStatic minWidth="150px">
          <EndTimeTrans />
        </Button>
        <DateTimeInput name="to" minDate={minDate} />
      </Group>

      <Button
        palette="primary"
        onClick={(event) => {
          //TODO: trigger extra validation? focus on input?
          if (from && to) {
            add({
              from,
              to,
              scheduleStatus
            })
            setValue("from", null)
            setValue("to", null)
          }
        }}
        disabled={!from || !to}
      >
        <AddTrans />
      </Button>
    </Set>
  )
}

const ScheduleStatusDropdownMenu = ({
  name = "scheduleStatus",
  items,
  setScheduleStatus
}) => {
  let { setValue, watch, getValues, control } = useFormContext()
  useEffect(() => {
    let result = items.reduce(
      ({ isSame, scheduleStatus }, item, index) => {
        if (!isSame) {
          return {
            isSame,
            scheduleStatus
          }
        }

        if (index === 0) {
          //init
          return {
            isSame,
            scheduleStatus: item.scheduleStatus
          }
        }

        if (item.scheduleStatus !== scheduleStatus) {
          return {
            isSame: false
          }
        }

        return {
          isSame,
          scheduleStatus
        }
      },
      {
        isSame: true,
        scheduleStatus: undefined
      }
    )

    if (result.isSame) {
      setValue(name, result.scheduleStatus ?? ScheduleStatus.Enabled)
    }
  }, [JSON.stringify(items)])
  return (
    <Controller
      control={control}
      name={name}
      shouldUnregister={true}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { isTouched, isDirty }
      }) => {
        return (
          <DropdownMenu
            menu={
              <>
                {value != ScheduleStatus.Enabled && (
                  <DropdownMenu.Item
                    onClick={() => {
                      setScheduleStatus(ScheduleStatus.Enabled)
                      setValue(name, ScheduleStatus.Enabled)
                    }}
                  >
                    <ScheduleStatusLabel value={ScheduleStatus.Enabled} />
                  </DropdownMenu.Item>
                )}
                {value != ScheduleStatus.Disabled && (
                  <DropdownMenu.Item
                    onClick={() => {
                      setScheduleStatus(ScheduleStatus.Disabled)
                      setValue(name, ScheduleStatus.Disabled)
                    }}
                  >
                    <ScheduleStatusLabel value={ScheduleStatus.Disabled} />
                  </DropdownMenu.Item>
                )}
              </>
            }
            marginBottom="major-1"
          >
            <Group>
              <Button isStatic={!!value}>
                <StatusTrans />
              </Button>
              {value && (
                <Button
                  palette={value === "Enabled" ? "success" : "danger"}
                  color="#fff"
                  css={css`
                    &:focus {
                      box-shadow: none !important;
                    }
                  `}
                >
                  <ScheduleStatusLabel value={value} />
                </Button>
              )}
            </Group>
          </DropdownMenu>
        )
      }}
    />
  )
}
