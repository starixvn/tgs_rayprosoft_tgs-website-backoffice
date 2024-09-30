import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useFormContext, useFieldArray, Controller } from "react-hook-form"
import {
  Table,
  Set,
  Heading,
  Text,
  useModalState,
  Icon,
  Box,
  Stack
} from "bumbag"
import { isAllPropChecked } from "../../checkbox/isAllChecked"
import {
  LanguageCheckboxGroupTableHeadRow,
  LanguageCheckboxGroupTableRow
} from "../../language/LanguageCheckboxGroup"
import { Trans, useTrans } from "../../i18n"
import Input from "../../input/Input"
import Backdrop from "../../dialog/Backdrop"
import FormDialog from "../../form/FormDialog"
import Disclosure from "../../dialog/Disclosure"
import { CloseText, ConfirmText } from "../../button/ActionButtons"
import { faLanguage } from "@fortawesome/free-solid-svg-icons"

export const BrandLanguageCheckboxGroupTable = ({
  name = "languages",
  fieldArrayContext,
  width = "100%",
  disabled = false,
  brandCultureCodeReadOnly = false,
  ...props
}) => {
  let { control, setValue, watch } = useFormContext()

  let { fields } = fieldArrayContext

  let selection = watch(name)
  let allChecked = isAllPropChecked(selection)
  return useMemo(() => {
    return (
      <Set orientation="vertical" width={width}>
        <Table width={width}>
          <Table.Head>
            <LanguageCheckboxGroupTableHeadRow
              name={name}
              fields={fields}
              checkedFieldName={checkedFieldName}
              allChecked={allChecked}
              disabled={disabled}
              addonAfter={
                <Table.HeadCell textAlign="center">
                  <Trans zh="设定" en="Setting" />
                </Table.HeadCell>
              }
            />
          </Table.Head>
          <Table.Body
            css={css`
              tr {
                background: #fff !important;
                &:not(:last-child) {
                  border-bottom: 1px solid #dbdfe6 !important;
                }
                th {
                  background: #fff !important;
                }
              }
            `}
          >
            {fields.map((field, index) => {
              return (
                <LanguageCheckboxGroupTableRow
                  key={field._id}
                  name={name}
                  disabled={disabled}
                  field={field}
                  index={index}
                  checkedFieldName={checkedFieldName}
                  addonAfter={
                    <Table.Cell textAlign="center">
                      <Controller
                        control={control}
                        name={brandCultureCodeFieldName(name, field, index)}
                        defaultValue={
                          field.brandCultureCode ?? field.cultureCode
                        }
                        shouldUnregister={true}
                        render={({
                          field: {
                            onChange,
                            onBlur,
                            value,
                            name: fieldName,
                            ref
                          },
                          fieldState: { isTouched, isDirty, error }
                        }) => {
                          let dialog = useModalState()
                          return (
                            <Box>
                              <Disclosure
                                {...dialog}
                                css={css`
                                  padding: 10px 12px;
                                  height: 38px;
                                  min-height: 38px;
                                  &:focus {
                                    box-shadow: none !important;
                                    border: 1px solid #d9d9e1;
                                  }
                                `}
                              >
                                <Icon icon={faLanguage} type="font-awesome" />
                              </Disclosure>
                              {dialog.visible && (
                                <CodeDialog
                                  value={value}
                                  disabled={disabled}
                                  readOnly={brandCultureCodeReadOnly}
                                  dialog={dialog}
                                  onChange={(code) => {
                                    if (!brandCultureCodeReadOnly) {
                                      setValue(
                                        fieldName,
                                        code ?? field.cultureCode
                                      )
                                    }
                                  }}
                                />
                              )}
                            </Box>
                          )
                        }}
                      />
                    </Table.Cell>
                  }
                />
              )
            })}
          </Table.Body>
        </Table>
      </Set>
    )
  }, [JSON.stringify(selection), JSON.stringify(fields)])
}

const CodeDialog = ({ value, disabled, readOnly, dialog, onChange }) => {
  let title = useTrans({
    zh: `平台语言代码`,
    en: `Platform Culture Code`
  })
  let editable = !(disabled || readOnly)
  return (
    <Backdrop {...dialog}>
      <FormDialog
        stopPropagation={true}
        onSubmit={({ code }) => {
          onChange(code)
          dialog.hide()
        }}
        submitText={editable ? <ConfirmText /> : <CloseText />}
        showActionButtons={editable}
        dialog={dialog}
        title={title}
        hideBackdrop={true}
        minWidth="25vw"
        css={css`
          & .bb-DialogHeader {
            margin-bottom: 0;
          }
        `}
      >
        <Stack orientation="vertical" padding="5rem 1rem 1rem 1rem">
          <Input
            name="code"
            defaultValue={value}
            disabled={disabled}
            readOnly={readOnly}
          />
        </Stack>
      </FormDialog>
    </Backdrop>
  )
}

const checkedFieldName = (name, field, index) => `${name}.${index}.checked`

const brandCultureCodeFieldName = (name, field, index) => {
  let result = `${name}.${index}.brandCultureCode`
  return result
}
