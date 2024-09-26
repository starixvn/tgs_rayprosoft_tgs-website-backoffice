import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext
} from "react"
import { css, Global } from "@emotion/react"
import {
  PageContent,
  Heading,
  Set,
  Box,
  Button,
  Level,
  Text,
  Link,
  FieldStack,
  Alert,
  List,
  useBreakpoint
} from "bumbag"
import BrandBar from "../report/BrandBar"
import { useUserBrandId } from "../user/context"
import { useMeasure } from "react-use"

const Store = createContext()

export const PlatformPageContent = ({
  title,
  addonAfterTitle,
  height = "100%",
  children,
  ...props
}) => {
  let userPlatformId = useUserBrandId()
  let [platformId, setPlatformId] = useState(userPlatformId)
  let [platform, setPlatform] = useState()

  let [ref, measure] = useMeasure()

  //TODO: also work with url?
  let isMobile = useBreakpoint("mobile")
  //TODO: title and actionbar overflow visible?
  return (
    <Store.Provider
      value={{
        platformId,
        platform,
        setPlatform,
        width: measure?.width
      }}
    >
      <PageContent
        ref={ref}
        maxWidth="unset"
        height={height}
        wrapperProps={{
          height
        }}
        {...props}
      >
        <Set orientation="vertical" isFilled>
          <Set orientation="horizontal" alignY="center" marginBottom="8px">
            <BrandBar
              onBrandChange={(value) => {
                setPlatformId(value)
              }}
            />
          </Set>
        </Set>

        {platformId && (
          <Box
            css={css`
              background: #fff;
              padding: 1rem;
              border: 1px solid #080a0c2d;
              border-radius: 0.375rem;
              position: relative;
              .custom-width-table {
                width: 100% !important;
              }
            `}
          >
            <Box>
              <Heading use="h3" marginTop="major-2" marginBottom="major-3">
                {title}
              </Heading>
              {addonAfterTitle}
            </Box>
            {platformId && children}
          </Box>
        )}
      </PageContent>
    </Store.Provider>
  )
}

export const usePlatformId = () => {
  let { platformId } = useContext(Store) ?? {}
  return platformId
}

export const usePlatformPageContentWidth = () => {
  let { width } = useContext(Store) ?? {}
  return width
}

//TODO: rm
export const usePlatform = () => {
  let { platformId, platform, setPlatform } = useContext(Store) ?? {}
  useEffect(() => {
    //TODO: fetch platform info if platform.id != platformId?
  }, [platformId, platform?.id])

  return platform
}
