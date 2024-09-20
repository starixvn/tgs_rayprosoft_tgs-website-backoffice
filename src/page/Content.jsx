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
  Heading,
  PageContent as _PageContent,
  Box,
  Stack,
  Table,
  Card,
  Button,
  InputField,
  Set,
  Divider
} from "bumbag"
import { useMeasure } from "react-use"

const Store = createContext()

export const PageContent = ({
  title,
  actionBar,
  height = "max-content",
  children,
  ...props
}) => {
  return (
    <Store.Provider value={{}}>
      <_PageContent
        maxWidth="unset"
        height={height}
        padding="1.5rem"
        wrapperProps={{
          height
        }}
        {...props}
      >
        <Set
          orientation="vertical"
          height="100%"
          isFilled
          css={css`
            background: #fff;
            padding: 1rem;
            border: 1px solid #080a0c2d;
            border-radius: 0.375rem;
          `}
        >
          {title && (
            <Box marginBottom="major-3" marginTop="major-2">
              <Heading
                use="h3"
                css={css`
                  font-size: 2rem !important;
                `}
              >
                {title}
              </Heading>
            </Box>
          )}
          <Box
            css={css`
              padding: 1rem;
              background: #f3f4f7;
            `}
          >
            <Box marginBottom="major-2">
              {actionBar && <Stack orientation="horizontal">{actionBar}</Stack>}
            </Box>
            <Box flex="1">{children}</Box>
          </Box>
        </Set>
      </_PageContent>
    </Store.Provider>
  )
}

export default PageContent
