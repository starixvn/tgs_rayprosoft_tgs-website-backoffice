import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set, Link, Group, Button, Icon } from "bumbag"
import { Trans } from "../../i18n"
import { useUploadImage } from "./client"
import { LocalizationDialogDisclosure } from "../../dialog/LocalizationDialog"
import { StaticButton } from "../../button/StaticButton"
import { useFormContext, useWatch } from "react-hook-form"
import FileUploadButton from "./FileUploadButton"
import { faEye } from "@fortawesome/free-solid-svg-icons"

const DefaultAccept = "image/jpeg, image/png, image/webp"

export const ImageUploadButton = ({
  id,
  name = "",
  label,
  brandId = "",
  prefix = "",
  disabled = false,
  readOnly = false,
  required = false,
  onUploaded,
  showLocalizationAddonAfter = true,
  ...props
}) => {
  return (
    <Set {...props}>
      <Group>
        <UploadButton
          id={id}
          name={name}
          label={label}
          prefix={prefix}
          disabled={disabled}
          required={required}
        />
        {showLocalizationAddonAfter && (
          <LocalizationDialogDisclosure
            brandId={brandId}
            name={name}
            localizationField={LocalizationUploadImageField}
            localizationFieldProps={{
              prefix
            }}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
      </Group>
      <OpenLinkButton name={name} disabled={disabled} />
    </Set>
  )
}

export const ImageLocalizationDialogDisclosure = ({
  name = "",
  label,
  brandId = "",
  prefix = "",
  disabled = false,
  readOnly = false,
  onUploaded,
  ...props
}) => {
  return (
    <Set {...props}>
      <LocalizationDialogDisclosure
        brandId={brandId}
        name={name}
        localizationField={LocalizationUploadImageField}
        localizationFieldProps={{
          prefix
        }}
        disabled={disabled}
        readOnly={readOnly}
      />
      <OpenLinkButton name={name} disabled={disabled} />
    </Set>
  )
}

const LocalizationUploadImageField = ({ code, prefix, disabled }) => {
  let name = code
  return (
    <Set
      css={css`
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: 8px;
        &:last-child {
          margin-bottom: 0;
        }
      `}
    >
      <Group
        css={css`
          width: 100%;
          .bb-Button {
            &:first-child {
              min-width: 90px;
            }
            &:last-child {
              width: 100%;
            }
          }
        `}
      >
        <StaticButton>{code}</StaticButton>
        <UploadButton name={name} prefix={prefix} disabled={disabled} />
      </Group>
      <OpenLinkButton name={name} disabled={disabled} />
    </Set>
  )
}

const OpenLinkButton = ({ name, disabled }) => {
  let { control, setValue } = useFormContext()
  let url = useWatch({
    control,
    name
  })
  if (!url) {
    return null
  }

  return (
    <StaticButton>
      <Link href={url} target="_blank" color="#06c">
        {/* <Trans zh="查看图片" en="View Image" /> */}
        <Icon
          icon={faEye}
          type="font-awesome"
          color="#080a0c"
          fontSize="16px"
          fontWeight="400"
        />
      </Link>
      {!disabled && (
        <Button.Close
          onClick={(event) => {
            setValue(name, "")
          }}
          disabled={disabled}
          css={css`
            background: none !important;
            &:focus {
              box-shadow: none !important;
            }
          `}
        />
      )}
    </StaticButton>
  )
}

const UploadButton = ({ label, prefix, ...props }) => {
  const useUpload = (body) => useUploadImage(prefix, body)

  return (
    <FileUploadButton
      accept=".jpeg,.png,.webp"
      useUpload={useUpload}
      {...props}
    >
      {label || <Trans zh="图片上传" en="Image Upload" />}
    </FileUploadButton>
  )
}

export default ImageUploadButton
