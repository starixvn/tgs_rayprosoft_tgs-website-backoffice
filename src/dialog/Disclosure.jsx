import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react"
import { Button, Modal, css, Icon } from "bumbag"
import { Trans } from "../i18n"
import {
  faCog,
  faMinus,
  faPlus,
  faMagnifyingGlass,
  faPen,
  faTrash
} from "@fortawesome/free-solid-svg-icons"
import {
  AddTrans,
  DeleteTrans,
  DetailTrans,
  EditTrans,
  ReviewTrans,
  VerifyTrans,
  ViewTrans
} from "../trans/Action"

export const Disclosure = forwardRef(
  ({ use = Button, children, ...props }, ref) => (
    <Modal.Disclosure
      ref={ref}
      use={use}
      flex="unset"
      css={css`
        white-space: nowrap;
        &:focus {
          border: 1px solid #d9d9e1;
          box-shadow: none !important;
        }
      `}
      {...props}
    >
      {children}
    </Modal.Disclosure>
  )
)

export const ViewDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props} palette="success">
    {/* <ViewTrans /> */}
    <Icon
      icon={faMagnifyingGlass}
      type="font-awesome"
      color="#080a0c"
      fontSize="16px"
      fontWeight="400"
    />
  </Disclosure>
))

export const EditDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props} palette="secondary">
    <Icon
      icon={faPen}
      type="font-awesome"
      color="#080a0c"
      fontSize="16px"
      fontWeight="400"
    />
    {/* <EditTrans /> */}
  </Disclosure>
))

export const AddDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <AddTrans />
  </Disclosure>
))

export const DeleteDisclosure = forwardRef(
  ({ palette = "danger", variant = "primary", ...props }, ref) => (
    <Disclosure ref={ref} palette={palette} variant={variant} {...props}>
      {/* <DeleteTrans /> */}
      <Icon
        icon={faTrash}
        type="font-awesome"
        color="#080a0c"
        fontSize="16px"
        fontWeight="400"
      />
    </Disclosure>
  )
)

export const DetailDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <DetailTrans />
  </Disclosure>
))

//TODO: rm VerifyDisclosure and use ReviewDisclosure only?
export const VerifyDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <VerifyTrans />
  </Disclosure>
))

export const ReviewDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props} palette="info">
    <ReviewTrans />
    {/* <Icon
      icon={faMagnifyingGlass}
      type="font-awesome"
      color="#080a0c"
      fontSize="16px"
      fontWeight="400"
    /> */}
  </Disclosure>
))

export const ConfigIconDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props} palette="info">
    <Icon icon={faCog} type="font-awesome" />
  </Disclosure>
))

export const AddIconDisclosure = forwardRef((props, ref) => (
  <Disclosure
    palette="primary"
    ref={ref}
    {...props}
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
    <Icon icon={faPlus} type="font-awesome" />
  </Disclosure>
))

export const DeleteIconDisclosure = forwardRef(
  ({ palette = "danger", variant = "primary", ...props }, ref) => (
    <Disclosure
      ref={ref}
      palette={palette}
      variant={variant}
      {...props}
      color="#fff"
    >
      <Icon icon={faMinus} type="font-awesome" />
    </Disclosure>
  )
)

export default Disclosure
