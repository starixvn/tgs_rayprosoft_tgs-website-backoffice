import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Text, Modal, Set } from "bumbag"
import { DepartmentSelect } from "../departments/DepartmentSelect"
import { RoleSelect } from "../roles/select"
import { Trans, useTrans } from "../../i18n"
import { AdminStatusSelect } from "./AdminStatus"
import { Create as CreateMenu, Update as UpdateMenu } from "./menu"
import {
  useIsDisplayMenuByRoute,
  useUserBrandId,
  useUserLicenseeId,
  useUserResellerId,
  useUserRoleType
} from "../../user/context"
import { useAddAdmin, useEditAdmin, useEditPassword } from "./client"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import Disclosure from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { PasswordInputField } from "../../input/PasswordInput"
import { useFormContext } from "react-hook-form"
import { InputField, Input } from "../../input/Input"
import {
  adminOrNextRoleType,
  nextRoleType,
  RoleTypes,
  RoleTypeSelect,
  useRoleTypeOptions
} from "../roles/type"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import { useRole } from "../roles/client"
import clone from "clone-deep"
import {
  ChangePasswordTrans,
  NameTrans,
  UserNameTrans,
  useChangePasswordTrans
} from "../../trans/User"
import { StatusTrans } from "../../trans/Status"
import {
  AddTrans,
  EditTrans,
  useAddTrans,
  useEditTrans
} from "../../trans/Action"
import { DepartmentTrans } from "../../trans/Platform"

export const AddButton = ({ onSubmitted, ...props }) => {
  let dialog = Modal.useState()

  let isDisplay = useIsDisplayMenuByRoute([CreateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure
        {...dialog}
        {...props}
        css={css`
          background: #4b49b6;
          color: #fff;
          border-radius: 6px !important;
          border: 1px solid !important;
          font-weight: 400;
          &:focus,
          &:hover,
          &:active {
            background: #4b49b6;
            box-shadow: none !important;
          }
          &:hover {
            &:active {
              background: #4b49b6;
            }
          }
        `}
      >
        <AddTrans />
      </Disclosure>
      {dialog.visible && (
        <AddDialog onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

export const EditButton = ({ user, onSubmitted, ...props }) => {
  let dialog = Modal.useState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure
        {...dialog}
        {...props}
        palette="primary"
        css={css`
          padding: 10px 12px;
          height: 38px;
          min-height: 38px;
          border: none;
          &:focus {
            box-shadow: none !important;
          }
        `}
      >
        <EditTrans />
      </Disclosure>
      {dialog.visible && (
        <EditDialog user={user} onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

export const EditPasswordButton = ({ user, onSubmitted, ...props }) => {
  let dialog = Modal.useState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure
        {...dialog}
        {...props}
        palette="primary"
        css={css`
          padding: 10px 12px;
          height: 38px;
          min-height: 38px;
          border: none;
          &:focus {
            box-shadow: none !important;
          }
        `}
      >
        <ChangePasswordTrans />
      </Disclosure>
      {dialog.visible && (
        <AdminUserChangePasswordDialog
          userId={user.id}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

export const AdminUserChangePasswordDialog = ({
  userId,
  onSubmitted,
  dialog,
  ...props
}) => {
  let [submitData, setSubmit] = useState()
  let { result, error, isLoading, deleteCache } = useEditPassword(
    userId,
    submitData
  )

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  let title = useChangePasswordTrans()
  return (
    <FormDialog
      id="edit-user-password-dialog"
      defaultValues={{
        id: userId,
        password: "",
        confirmPassword: ""
      }}
      onSubmit={setSubmit}
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
    >
      <PasswordBody dialog={dialog} />
    </FormDialog>
  )
}

const PasswordBody = ({ dialog }) => {
  let { watch } = useFormContext()
  let password = watch("password")
  return (
    <Stack padding="5rem 1rem 1rem 1rem">
      <FieldValues marginBottom="0">
        <Label name="password" required>
          <Trans zh="密码" en="Password" />
        </Label>
        <Box>
          <PasswordInputField name="password" autoComplete="off" />
        </Box>

        <Label name="confirmassword" required>
          <Trans zh="确认密码" en="Confirm Password" />
        </Label>
        <Box>
          <PasswordInputField
            name="confirmPassword"
            matchPassword={password}
            autoComplete="off"
          />
        </Box>
      </FieldValues>
      <Input name="id" type="hidden" />
    </Stack>
  )
}

const AddDialog = ({ onSubmitted, dialog, finalFocusRef, ...props }) => {
  let title = useAddTrans()

  let [submitData, setSubmit] = useState()
  let { result, error, isLoading, deleteCache } = useAddAdmin(submitData)

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  return (
    <FormDialog
      id="add-user-dialog"
      defaultValues={{
        username: "",
        departmentId: "",
        roleId: "",
        name: "",
        password: "",
        confirmPassword: ""
      }}
      onSubmit={setSubmit}
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
      finalFocusRef={finalFocusRef}
      maxWidth="80vw"
      minWidth="45vw"
    >
      <AddBody dialog={dialog} />
    </FormDialog>
  )
}

const AddBody = ({}) => {
  let { watch, setValue } = useFormContext()
  let password = watch("password")

  let userResellerId = useUserResellerId()
  let [resellerId, setResellerState] = useState(userResellerId)
  const setResellerId = (value) => {
    if (!userResellerId) {
      //admin user
      setResellerState(value)
    }

    //ignore change
  }

  let userLicenseeId = useUserLicenseeId()
  let [licenseeId, setLicenseeState] = useState(userLicenseeId)
  const setLicenseeId = (value) => {
    if (!userLicenseeId) {
      //reseller user
      setLicenseeState(value)
    }

    //ignore change
  }

  let userBrandId = useUserBrandId()
  let [brandId, setBrandState] = useState(userBrandId)
  const setBrandId = (value) => {
    if (!userBrandId) {
      //licensee user
      setBrandState(value)
    }

    //ignore change
  }

  return (
    <Stack padding="5rem 1rem 1rem 1rem">
      <FieldValues
        css={css`
          gap: 16px 24px;
          input {
            border: 1px solid #dbdfe6;
            &:focus {
              box-shadow: none !important;
            }
          }
        `}
      >
        <UsernameLabel required />
        <Box>
          <InputField name="username" required />
        </Box>

        <RoleLabel required />
        <RoleSelectGroup
          resellerId={resellerId}
          setResellerId={setResellerId}
          licenseeId={licenseeId}
          setLicenseeId={setLicenseeId}
          brandId={brandId}
          setBrandId={setBrandId}
          emptyDepartment={() => {
            setValue("departmentId", "")
          }}
        />

        <DepartmentLabel required />
        <Box width="100%">
          <DepartmentSelect
            name="departmentId"
            required
            resellerId={resellerId}
            licenseeId={licenseeId}
            brandId={brandId}
            width="100%"
            minWidth="100%"
          />
        </Box>

        <NameLabel required />
        <Box>
          <InputField name="name" required />
        </Box>

        <Label name="password" required>
          <Trans zh="密码" en="Password" />
        </Label>
        <Box>
          <PasswordInputField name="password" autoComplete="off" />
        </Box>

        <Label name="confirmPassword" required>
          <Trans zh="确认密码" en="Confirm Password" />
        </Label>
        <Box>
          <PasswordInputField
            name="confirmPassword"
            matchPassword={password}
            autoComplete="off"
          />
        </Box>
      </FieldValues>
    </Stack>
  )
}

const RoleSelectGroup = ({
  resellerId,
  setResellerId,
  licenseeId,
  setLicenseeId,
  brandId,
  setBrandId,
  emptyDepartment
}) => {
  let userRoleType = useUserRoleType()
  let { watch, setValue, getValues, reset } = useFormContext()
  let roleTypeOptions = useRoleTypeOptions()

  let roleType = watch("roleType")
  let roleId = watch("roleId")

  const onMerchantResetted = () => {
    setValue("roleId", "")
    emptyDepartment?.()
  }
  return (
    <Set
      orientation="horizontal"
      css={css`
        flex-wrap: nowrap;
        gap: 6px;
        > .bb-Box {
          width: 100%;
        }
      `}
    >
      {roleTypeOptions.length > 1 && (
        <>
          <RoleTypeSelect
            name="roleType"
            defaultValue={roleType}
            required
            onChange={(event) => {
              let role = event.target.value
              setValue("roleType", role)

              if (
                !role ||
                role === RoleTypes.Admin ||
                role === RoleTypes.Reseller
              ) {
                setResellerId("")
                setLicenseeId("")
                setBrandId("")
              }
              if (role === RoleTypes.Licensee) {
                setLicenseeId("")
                setBrandId("")
              }
              if (role === RoleTypes.Brand) {
                setBrandId("")
              }
              onMerchantResetted()
              let values = getValues()
              reset(values)
            }}
          />
          {roleType && roleType != RoleTypes.Admin && (
            <MerchantIdSelect
              start={adminOrNextRoleType(userRoleType)}
              end={roleType}
              resellerProps={{
                value: resellerId,
                onChange: (value) => {
                  setResellerId(value)
                  onMerchantResetted()
                }
              }}
              licenseeProps={{
                value: licenseeId,
                onChange: (value) => {
                  setLicenseeId(value)
                  onMerchantResetted()
                }
              }}
              brandProps={{
                value: brandId,
                onChange: (value) => {
                  setBrandId(value)
                  onMerchantResetted()
                }
              }}
            />
          )}
        </>
      )}
      <RoleSelect
        name="roleId"
        defaultValue={roleId}
        required
        resellerId={resellerId}
        licenseeId={licenseeId}
        brandId={brandId}
      />
    </Set>
  )
}

const UsernameLabel = ({ name = "username", required }) => (
  <Label name={name} required={required}>
    <UserNameTrans />
  </Label>
)

const DepartmentLabel = ({ name = "departmentId", required }) => (
  <Label name={name} required={required}>
    <DepartmentTrans />
  </Label>
)

const RoleLabel = ({ name = "roleId", required }) => (
  <Label name={name} required={required}>
    <Trans zh="权限组" en="Role" />
  </Label>
)

const NameLabel = ({ name = "name", required }) => (
  <Label name={name} required={required}>
    <NameTrans />
  </Label>
)

const EditDialog = ({ user = {}, onSubmitted, dialog, ...props }) => {
  let title = useEditTrans()

  let [submitData, setSubmit] = useState()
  let { result, error, mutate, isLoading, deleteCache } = useEditAdmin(
    user?.id,
    submitData
  )

  const submit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  let userRoleType = useUserRoleType()
  let roleType = userRoleType
  if (user?.resellerId) {
    roleType = RoleTypes.Reseller
  }
  if (user?.licenseeId) {
    roleType = RoleTypes.Licensee
  }
  if (user?.brandId) {
    roleType = RoleTypes.Brand
  }

  return (
    <FormDialog
      id="edit-user-dialog"
      defaultValues={{ ...clone(user), roleType }}
      onSubmit={submit}
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
      maxWidth="80vw"
      minWidth="50vw"
    >
      <EditBody user={user} dialog={dialog} />
    </FormDialog>
  )
}

const EditBody = ({ user }) => {
  let { watch, setValue, getValues } = useFormContext()

  let username = watch("username")
  let userResellerId = useUserResellerId()
  let [resellerId, setResellerState] = useState(user?.resellerId)
  const setResellerId = (value) => {
    if (!userResellerId) {
      //admin user
      setResellerState(value)
    }

    //ignore change
  }

  let userLicenseeId = useUserLicenseeId()
  let [licenseeId, setLicenseeState] = useState(user?.licenseeId)
  const setLicenseeId = (value) => {
    if (!userLicenseeId) {
      //reseller user
      setLicenseeState(value)
    }

    //ignore change
  }

  let userBrandId = useUserBrandId()
  let [brandId, setBrandState] = useState(user?.brandId)
  const setBrandId = (value) => {
    if (!userBrandId) {
      //licensee user
      setBrandState(value)
    }

    //ignore change
  }

  let departmentId = watch("departmentId")

  return (
    <Stack padding="5rem 1rem 1rem 1rem">
      <FieldValues marginBottom="0">
        <UsernameLabel />
        <Box>
          <InputField type="hidden" name="username" />
          <InputField value={username} disabled />
        </Box>

        <RoleLabel />
        <RoleSelectGroup
          resellerId={resellerId}
          setResellerId={setResellerId}
          licenseeId={licenseeId}
          setLicenseeId={setLicenseeId}
          brandId={brandId}
          setBrandId={setBrandId}
          emptyDepartment={() => {
            setValue("departmentId", "")
          }}
        />

        <DepartmentLabel />
        <Box>
          <DepartmentSelect
            name="departmentId"
            defaultValue={departmentId}
            required
            resellerId={resellerId}
            licenseeId={licenseeId}
            brandId={brandId}
          />
        </Box>

        <NameLabel />
        <Box>
          <InputField name="name" required />
        </Box>

        <Label htmlFor="status">
          <StatusTrans />
          <Text color="danger">*</Text>
        </Label>
        <Box>
          <AdminStatusSelect name="status" required />
        </Box>
      </FieldValues>
      <Input name="id" type="hidden" />
    </Stack>
  )
}

const useCreateTitle = () =>
  useTrans({
    zh: "新增管理员",
    en: "Add Admin"
  })
