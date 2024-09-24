import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  createContext,
  useContext
} from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Dialog, Button, Box } from "bumbag"
import AlertDialog from "../dialog/Alert"
import { CancelTrans, SubmitTrans } from "../trans/Action"

export const FormDialog = ({
  formRef,
  defaultValues,
  onSubmit,
  onClickSubmit,
  onClickCancel,
  isLoading,
  result,
  error,
  onCloseErrorAlert,
  onSubmitted,
  children,
  dialog,
  hideOnClickOutside = false,
  showCloseButton = true,
  showActionButtons = true,
  cancelText = <CancelTrans />,
  submitText = <SubmitTrans />,
  addonButtons,
  actionButtonsProps = {},
  formMethods,
  stopPropagation = false,
  ...props
}) => {
  let methods = useForm({ defaultValues })
  formMethods = formMethods ?? methods

  useEffect(() => {
    if (result && !error) {
      onSubmitted?.()
      dialog.hide()
      formMethods.reset()
    }
  }, [result])

  return (
    <>
      <Dialog.Modal
        wrap={(children) => (
          <FormProvider {...formMethods}>
            <form
              ref={formRef}
              onSubmit={(event) => {
                if (isLoading) {
                  console.warn("form currently loading, skip submit")
                  event.preventDefault()
                  event.stopPropagation()
                  return
                }

                if (stopPropagation) {
                  event.stopPropagation()
                }
                formMethods.handleSubmit(onSubmit)(event)
              }}
              css={css`
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              `}
            >
              {children}
            </form>
          </FormProvider>
        )}
        showActionButtons={showActionButtons}
        actionButtonsProps={{
          isLoading: isLoading,
          onClickSubmit,
          onClickCancel,
          cancelText,
          submitText,
          addonButtons:
            typeof addonButtons === "function"
              ? addonButtons(formMethods)
              : addonButtons,
          ...actionButtonsProps
        }}
        showCloseButton={showCloseButton}
        hideOnClickOutside={hideOnClickOutside}
        {...dialog}
        css={css`
          min-width: 320px;
          max-width: 70vw;
          overflow: hidden;
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

          & .bb-DialogFooter {
            border-top: 1px solid #dbdfe6;
            padding: 0.8rem;
            background: #fff;
            > div > button {
              &:focus {
                box-shadow: none !important;
              }
            }
          }
        `}
        {...props}
      >
        {children}
      </Dialog.Modal>
      {error && <AlertDialog {...error} onClickClose={onCloseErrorAlert} />}
    </>
  )
}

//TODO: replace or remove
export const WarningConfirmFormDialog = ({ type = "warning", ...props }) => (
  <FormDialog type={type} {...props} />
)

export default FormDialog
