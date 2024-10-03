import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Modal, Box, Icon } from "bumbag"
import { Create as CreateMenu, Update as UpdateMenu } from "./menu"
import {
  useIsDisplayMenuByRoute,
  useUserBrandId,
  useUserLicenseeId,
  useUserResellerId,
  useUserRoleType
} from "../../user/context"
import { Trans, useTrans } from "../../i18n"
import { useAddDepartment, useEditDepartment } from "./client"
import Label from "../../form/Label"
import { FieldValues } from "../../layout/Grid"
import Disclosure from "../../dialog/Disclosure"
import {
  useForm,
  useFormContext,
  FormProvider,
  useWatch
} from "react-hook-form"
import FormDialog from "../../form/FormDialog"
import Input from "../../input/Input"
import { nextRoleType, RoleTypeSelect, useRoleTypeOptions } from "../roles/type"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import ResellerIdSelect from "../../merchant/resellers/ResellerIdSelect"
import { useResellerLabel } from "../../merchant/resellers"
import LicenseeIdSelect from "../../merchant/licensees/LicenseeIdSelect"
import BrandIdSelect from "../../merchant/platforms/BrandIdSelect"
import {
  AddTrans,
  EditTrans,
  useAddTrans,
  useEditTrans
} from "../../trans/Action"
import {
  DepartmentNameTrans,
  LicenseeTrans,
  PlatformTrans
} from "../../trans/Platform"
import { WrapperModal } from "../../styles/wrapper"
import { cssSpacingRoleSelect, cssSpacingSelectEditFrom } from "./style"
import { faPen } from "@fortawesome/free-solid-svg-icons"

export const AddButton = ({
  onSubmitted,
  id,
  dialogId = "add-department-dialog",
  ...props
}) => {
  let dialog = Modal.useState()
  let isDisplay = useIsDisplayMenuByRoute([CreateMenu])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        <AddTrans />
      </Disclosure>
      {dialog.visible && (
        <AddDialog
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const AddDialog = ({ onSubmitted, dialog, dialogId, ...props }) => {
  let title = useAddTrans()

  let userResellerId = useUserResellerId()
  let userLicenseeId = useUserLicenseeId()
  let userBrandId = useUserBrandId()

  let [submitData, setSubmit] = useState()
  let { result, error, isLoading, mutate, deleteCache } =
    useAddDepartment(submitData)

  const onSubmit = (data) => {
    let base = {
      resellerId: userResellerId,
      licenseeId: userLicenseeId,
      brandId: userBrandId
    }

    let formData = { ...base, ...data }
    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={{
        name: ""
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      title={title}
      dialog={dialog}
      minWidth="50vw"
      id={dialogId}
    >
      <EditBody isAdd={true} />
    </FormDialog>
  )
}

const EditBody = ({ record = {}, isAdd = false }) => {
  let userRoleType = useUserRoleType()
  let roleTypeOptions = useRoleTypeOptions()

  let { watch } = useFormContext()
  let resellerId = watch("resellerId", record?.resellerId ?? "")
  let licenseeId = watch("licenseeId", record?.licenseeId ?? "")
  let brandId = watch("brandId", record?.brandId ?? "")

  return (
    <WrapperModal>
      <Box css={cssSpacingRoleSelect}>
        {isAdd && roleTypeOptions.length > 1 && (
          <>
            <Label name="roleType" marginBottom="8px">
              <Trans zh="类型" en="Type" />
            </Label>
            <Box>
              <MerchantIdSelect
                disabled={!isAdd}
                start={nextRoleType(userRoleType)}
                resellerProps={{
                  defaultValue: resellerId
                }}
                licenseeProps={{
                  defaultValue: licenseeId
                }}
                brandProps={{
                  defaultValue: brandId
                }}
                required={false}
                parentRequired={true}
              />
            </Box>
          </>
        )}
        {!isAdd && record?.resellerId && (
          <Box css={cssSpacingSelectEditFrom}>
            <Label marginBottom="8px">{useResellerLabel()}</Label>
            <ResellerIdSelect value={record?.resellerId} disabled />
          </Box>
        )}
        {!isAdd && record?.licenseeId && (
          <Box css={cssSpacingSelectEditFrom}>
            <Label marginBottom="8px">
              <LicenseeTrans />
            </Label>
            <LicenseeIdSelect value={record?.licenseeId} disabled />
          </Box>
        )}
        {!isAdd && record?.brandId && (
          <Box css={cssSpacingSelectEditFrom}>
            <Label marginBottom="8px">
              <PlatformTrans />
            </Label>
            <BrandIdSelect value={record?.brandId} disabled />
          </Box>
        )}
        <Label
          name="name"
          label={<DepartmentNameTrans />}
          marginBottom="8px"
          marginTop="16px"
        />
        <Box>
          <Input name="name" required />
        </Box>
      </Box>
    </WrapperModal>
  )
}

export const EditButton = ({ id = "", record, onSubmitted, ...props }) => {
  let dialog = Modal.useState()
  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  let dialogId = "edit-department-dialog"
  let disclosureId = `${dialogId}-disclosure`
  return (
    <>
      <Disclosure id={disclosureId} {...dialog} palette="secondary">
        {/* <EditTrans /> */}
        <Icon
          icon={faPen}
          type="font-awesome"
          color="#080a0c"
          fontSize="16px"
          fontWeight="400"
        />
      </Disclosure>
      {dialog.visible && (
        <EditDialog
          id={id}
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const EditDialog = ({
  id,
  record = {},
  dialog,
  dialogId,
  onSubmitted,
  ...props
}) => {
  let title = useEditTrans()

  let [submitData, setSubmit] = useState()
  let { result, error, isLoading, mutate, deleteCache } = useEditDepartment(
    id,
    submitData
  )

  let userResellerId = useUserResellerId()
  let userLicenseeId = useUserLicenseeId()
  let userBrandId = useUserBrandId()

  const onSubmit = (data) => {
    let base = {
      resellerId: userResellerId,
      licenseeId: userLicenseeId,
      brandId: userBrandId
    }

    let formData = { ...base, ...data }
    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={{ ...record }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      title={title}
      dialog={dialog}
      id={dialogId}
    >
      <EditBody record={record} />
    </FormDialog>
  )
}
