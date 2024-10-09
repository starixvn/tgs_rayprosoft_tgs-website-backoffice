import React, { useEffect, useState } from "react"
import { css } from "@emotion/react"
import { useAuth, useIsAuthed, useIsAuthLoading } from "./context"
import { useForm, FormProvider } from "react-hook-form"
import {
  Flex,
  Box,
  Card,
  Set,
  Button,
  Dialog,
  Modal,
  Image,
  Icon
} from "bumbag"
import Input from "../input/Input"
import { PasswordInputField } from "../input/PasswordInput"
import { LangDropdownMenu, useTrans } from "../i18n"
import { CloseText } from "../button/ActionButtons"
import {
  getLoginButtonBackground,
  getLoginButtonColor,
  getLoginImageUrl
} from "../env"
import { useNavigate, useSearchParams } from "react-router-dom"

import { faUserAlt, faLock } from "@fortawesome/free-solid-svg-icons"
import {
  cssCardPadding,
  cssInputName,
  cssInputPassWord,
  cssWrapper,
  cssWrapperIcon,
  cssWrapperInput
} from "./style"

export const Path = "/login"

export const Form = () => {
  const [searchParams] = useSearchParams()
  let formMethods = useForm({
    defaultValues: { username: "", password: "" }
  })

  const login = useAuth()
  let isAuthLoading = useIsAuthLoading()

  const dialog = Modal.useState()
  let [error, setError] = useState()
  const isAuthed = useIsAuthed()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get("token")
    const referenceId = searchParams.get("referenceId")
    const timestamp = searchParams.get("timestamp")
    if (token) {
      onSubmit({
        token,
        referenceId,
        timestamp
      })
    }
  }, [])

  useEffect(() => {
    isAuthed && navigate("/")
  }, [])

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
      <Box css={cssWrapper}>
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
          css={cssCardPadding}
        >
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <Set orientation="vertical" isFilled>
                <Box css={cssWrapperInput}>
                  <Box css={cssWrapperIcon}>
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
                    css={cssInputName}
                  />
                </Box>
                <Box css={cssWrapperInput}>
                  <Box css={cssWrapperIcon}>
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
                    css={cssInputPassWord}
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
