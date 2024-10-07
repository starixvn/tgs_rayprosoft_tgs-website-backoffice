import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Alert, Button, Text, Modal, Icon } from "bumbag"
import { Delete as DeleteMenu } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import { FormDialog } from "../../form/FormDialog"
import { Trans, useTrans } from "../../i18n"
import { useDeleteRole } from "./client"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { WrapperModal } from "../../styles/wrapper"

export const DeleteButton = ({ id, name, onSubmitted, ...props }) => {
  let dialog = Modal.useState()

  let isDisplay = useIsDisplayMenuByRoute([DeleteMenu])
  if (!isDisplay) {
    return null
  }

  let dialogId = `delete-role-dialog`
  let disclosureId = `${dialogId}-disclosure`
  return (
    <>
      <Disclosure palette="danger" id={disclosureId} {...dialog}>
        {/* <Trans zh="删除" en="Delete" /> */}
        <Icon
          icon={faTrash}
          type="font-awesome"
          color="#080a0c"
          fontSize="16px"
          fontWeight="400"
        />
      </Disclosure>
      {dialog.visible && (
        <DeleteDialog
          id={id}
          name={name}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const DeleteDialog = ({
  id,
  name = "",
  dialog,
  dialogId,
  onSubmitted,
  ...props
}) => {
  let [deleteId, setDelete] = useState()
  let { result, error, isLoading, mutate, deleteCache } =
    useDeleteRole(deleteId)

  const submit = () => {
    setDelete(id)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setDelete(null)
  }

  let title = useTrans({
    zh: "删除权限组",
    en: "Delete Role"
  })
  return (
    <FormDialog
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
      id={dialogId}
    >
      <WrapperModal>
        <Alert
          title={
            useTrans({
              en: `Confirm delete the `
            }) + ` “${name}”？`
          }
          type="warning"
          variant=""
        >
          <Text color="danger">
            <Trans
              zh="如果仍有管理员正使用此权限组，该权限组将不能够被删除"
              en="If an administrator is still using this role, it cannot be deleted"
            />
          </Text>
        </Alert>
      </WrapperModal>
    </FormDialog>
  )
}
