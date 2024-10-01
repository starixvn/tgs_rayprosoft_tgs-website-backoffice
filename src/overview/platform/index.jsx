import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Popover,
  Icon,
  List,
  Columns,
  useBreakpoint,
  Spinner,
  FieldStack
} from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { Trans } from "../../i18n"
import { useBrand } from "../../merchant/platforms/client"
import { Overview } from "./Overview"
import { TopPlayerTable } from "./TopPlayerTable"
import { TopGameTable } from "./TopGameTable"
import { useGameProviderCodeStylePairs } from "../client"
import { OverviewTrans } from "../../trans/Platform"
import { WrapperBg } from "../../styles/wrapper"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <PlatformDashboardPage />
}

export const CodeContentPair = [Code, Content]

export const PlatformDashboardPage = () => {
  return (
    <PlatformPageContent title={<OverviewTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

const Body = () => {
  /*
  TODO: need isDesktop or isWideScreen to decide spread?
  let isDesktop = useBreakpoint("min-desktop")
  let isWideScreen = useBreakpoint("min-widescreen")
  */

  let id = usePlatformId()
  let {
    isLoading: isLoadingBrand,
    data: brand,
    error,
    mutate,
    deleteCache
  } = useBrand(id)
  let {
    isLoading: isLoadingGameProviderCodeStylePairs,
    data: gameProviderCodeStylePairs
  } = useGameProviderCodeStylePairs()

  let isLoading = isLoadingBrand || isLoadingGameProviderCodeStylePairs

  if (isLoading) {
    return (
      <Box alignY="center" alignX="center">
        <Spinner />
      </Box>
    )
  }

  return (
    <WrapperBg>
      <WelcomeBox brand={brand} />
      <Columns spacing="minor-2">
        <Columns.Column spread={3}>
          <Overview />
        </Columns.Column>
        <Columns.Column spread={9}>
          <Columns spacing="minor-2">
            <Columns.Column spread={12}>
              <PlayerTableBox brand={brand} />
            </Columns.Column>
            <Columns.Column spread={12}>
              <GameTableBox
                gameProviderCodeStylePairs={gameProviderCodeStylePairs}
              />
            </Columns.Column>
          </Columns>
        </Columns.Column>
      </Columns>
    </WrapperBg>
  )
}

const WelcomeBox = ({ brand }) => {
  if (!brand?.code) {
    return null
  }

  return (
    <Box marginBottom="0.8rem">
      <Trans zh={`欢迎回来`} en={`Welcome back`} />
      <span>{`, ${brand.code}`}</span>
    </Box>
  )
}

const PlayerTableBox = ({ brand, ...props }) => {
  let id = usePlatformId()
  return <TopPlayerTable brand={brand} brandId={id} {...props} />
}

const GameTableBox = (props) => {
  let id = usePlatformId()
  return <TopGameTable brandId={id} {...props} />
}
