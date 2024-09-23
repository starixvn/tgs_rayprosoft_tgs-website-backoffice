import React, { useState } from "react"
import { css } from "@emotion/react"
import { useAuth, useIsAuthLoading } from "./context"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Flex,
  Box,
  Card,
  Set,
  Button,
  Dialog,
  Modal,
  Text,
  Heading,
  Image,
  Icon
} from "bumbag"
import Input from "../input/Input"
import { PasswordInputField } from "../input/PasswordInput"
import { LangDropdownMenu, useLocale, useTrans } from "../i18n"
import { CloseText } from "../button/ActionButtons"
import {
  getLoginButtonBackground,
  getLoginButtonColor,
  getLoginTitle,
  getLoginTitleColor,
  getLoginTitleFontSize,
  getLoginTitleFontWeight,
  getLoginSubTitle,
  getLoginSubTitleFontSize,
  getLoginImageUrl
} from "../env"

import { faUserAlt, faLock } from "@fortawesome/free-solid-svg-icons"

export const Path = "/login"

export const Form = () => {
  let formMethods = useForm({
    defaultValues: { username: "", password: "" }
  })

  const login = useAuth()
  let isAuthLoading = useIsAuthLoading()

  const dialog = Modal.useState()
  let [error, setError] = useState()

  const onSubmit = (data) => {
    setError(null)

    login(data).catch((error) => {
      setError(error.message ?? error.title)
      dialog.show()
    })
  }

  let loginLabel = useTrans({
    zh: "登录",
    en: "Login"
  })

  let usernameLabel = useTrans({
    zh: "帐号",
    en: "Username"
  })

  let passwordLabel = useTrans({
    zh: "密码",
    en: "Password"
  })

  let imgUrl = getLoginImageUrl()
  // let title = getLoginTitle()
  // let subTitle = getLoginSubTitle()
  return (
    <Box
      alignX="center"
      alignY="center"
      css={css`
        height: 80vh;
      `}
    >
      <Box
        css={css`
          width: 400px;
          border: 1px solid #d9d9e1;
          border-radius: 5px;
          padding: 20px 2.5rem 2.5rem;
          background: #ffffff;
          @media screen and (max-width: 576px) {
            width: 95%;
          }
        `}
      >
        <img
          src="/images/bo-logo.png"
          alt="bo-logo"
          style={{ margin: "0 auto" }}
        />
        {imgUrl && (
          <Box
            marginBottom="3rem"
            width="200px"
            css={css`
              aspect-ratio: 500 / 175;
            `}
          >
            <Image src={imgUrl} width="100%" filter="none" />
          </Box>
        )}
        {/* {title && (
        <Box marginBottom="1rem" alignX="center">
          <Text.Block
            color={getLoginTitleColor()}
            fontSize={getLoginTitleFontSize()}
            fontWeight={getLoginTitleFontWeight()}
          >
            {title}
          </Text.Block>
          {subTitle && (
            <Text.Block
              color={getLoginTitleColor()}
              fontWeight={getLoginTitleFontWeight()}
              fontSize={getLoginSubTitleFontSize()}
            >
              {subTitle}
            </Text.Block>
          )}
        </Box>
      )} */}
        <Card
          title={loginLabel}
          textTransform="uppercase"
          boxShadow="none"
          headerAddon={
            <Set>
              <LangDropdownMenu />
            </Set>
          }
          css={css`
            padding: 0;
            background: none;
          `}
        >
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <Set orientation="vertical" isFilled>
                <Box
                  css={css`
                    border: 1px solid #d9d9e1;
                    border-radius: 5px;
                    overflow: hidden;
                    margin-bottom: 16px !important;
                    display: flex;
                  `}
                >
                  <Box
                    css={css`
                      padding: 0.375rem 0.75rem;
                      background-color: #f3f4f7;
                      border-right: 1px solid #dbdfe6;
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <Icon
                      icon={faUserAlt}
                      type="font-awesome"
                      color="rgba(37, 43, 54, 0.38)"
                      fontSize="12px"
                    />
                  </Box>
                  <Input
                    name="username"
                    placeholder={usernameLabel}
                    autoComplete="username"
                    css={css`
                      width: 100%;
                      > input {
                        border: none !important;
                        height: 38px;
                        border-radius: 0 !important;
                      }
                    `}
                  />
                </Box>
                <Box
                  css={css`
                    border: 1px solid #d9d9e1;
                    border-radius: 5px;
                    overflow: hidden;
                    margin-bottom: 16px !important;
                    display: flex;
                  `}
                >
                  <Box
                    css={css`
                    padding: 0.375rem 0.75rem;
                    background-color: #f3f4f7;
                    border-right: 1px solid #dbdfe6;
                    display: flex;
                    align-items: center;s
                  `}
                  >
                    <Icon
                      icon={faLock}
                      type="font-awesome"
                      color="rgba(37, 43, 54, 0.38)"
                      fontSize="12px"
                    />
                  </Box>
                  <PasswordInputField
                    name="password"
                    type="password"
                    placeholder={passwordLabel}
                    autoComplete="current-password"
                    css={css`
                      width: 100%;
                      > div {
                        width: 100%;
                        input {
                          border: none !important;
                          height: 38px;
                          width: 100%;
                          border-radius: 0 !important;
                        }
                      }
                    `}
                  />
                </Box>
                <Button
                  type="submit"
                  color={getLoginButtonColor()}
                  background={getLoginButtonBackground()}
                  isLoading={isAuthLoading}
                  textTransform="uppercase"
                  border="none"
                  fontWeight="500"
                  minHeight="38px"
                  css={css`
                    :focus {
                      box-shadow: none !important;
                    }
                  `}
                >
                  {loginLabel}
                </Button>
              </Set>
            </form>
          </FormProvider>
        </Card>
      </Box>
      <ErrorDialog error={error} dialog={dialog} />
    </Box>
  )
}

const ErrorDialog = ({ dialog, error, ...props }) => {
  return (
    <Dialog.Modal
      type="danger"
      variant="alert"
      title={error}
      placement="top"
      footer={
        <Flex
          alignX="right"
          css={css`
            width: 100%;
          `}
        >
          <Modal.Disclosure use={Button} {...dialog}>
            <CloseText />
          </Modal.Disclosure>
        </Flex>
      }
      {...dialog}
    ></Dialog.Modal>
  )
}
