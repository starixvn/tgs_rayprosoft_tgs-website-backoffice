import React, { useState, useEffect } from "react"
import { Global, css } from "@emotion/react"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import {
  Container,
  PageContent,
  PageWithHeader,
  PageWithSidebar,
  TopNav,
  SideNav,
  Stack,
  Box,
  DropdownMenu,
  Button,
  Text,
  Alert,
  Modal,
  Icon,
  Flex,
  useModalState,
  Image,
  usePage,
  Hide
} from "bumbag"
import {
  useIsAuthed as useUserIsAuthed,
  useMenuCodes,
  useUserId
} from "./user/context"
import { Form as Login, Path as LoginPath } from "./user/login"
import { RequireAuth } from "./user/auth"
import { AllMenus } from "./menu"
import { AllContents } from "./content"
import { useUsername, useDeauth } from "./user/context"
import { SWRConfig } from "swr"
import {
  Trans,
  useLocale,
  Locales,
  useEnglish,
  useChinese,
  useVietnamese,
  useThai
} from "./i18n"
import { AdminUserChangePasswordDialog } from "./system/admins/edit"
import {
  getHeaderBackground,
  getHeaderButtonBackground,
  getHeaderButtonColor,
  getHeaderTitle,
  getHeaderTitleColor,
  getHeaderTitleFontSize,
  getHeaderTitleFontWeight,
  getHeaderImageUrl,
  isDev,
  Features,
  isFeatureEnabled
} from "./env"
import FundDepositTopNavItem from "./fund/deposit/FundDepositTopNavItem"
import FundWithdrawTopNavItem from "./fund/withdraw/FundWithdrawTopNavItem"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { init as initConnection } from "./connection"
import { ChangePasswordTrans } from "./trans/User"
import client from "./client"

//TODO: wait for PH's fix
if (isDev()) {
  initConnection()
}

function App() {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 200,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        revalidateOnMount: true
      }}
    >
      <Routes>
        <Route path={LoginPath} element={<Login />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <Layout>
                <AllContents />
              </Layout>
            </RequireAuth>
          }
        />
      </Routes>
    </SWRConfig>
  )
}

const HeaderHeight = "65px"
const sidebarWidth = 290
const FooterHeight = "0px" //"30px"

const Layout = ({ children }) => {
  return (
    <PageWithHeader
      sticky
      header={<Header />}
      headerHeight={HeaderHeight}
      overflow="hidden"
    >
      <PageWithSidebar
        id="pageWithSidebar"
        sidebar={<Sidebar />}
        sidebarPlacement="left"
        sidebarWidth={`${sidebarWidth}px`}
        minHeight={`calc(100vh - ${HeaderHeight})`}
        maxHeight={`calc(100vh - ${HeaderHeight})`}
        overflow="hidden"
        css={css`
          & .bb-PageWithSidebarSidebarExpandedWrapper {
            width: ${getSidebarWidth()}px;
          }

          & .bb-PageWithSidebarContent {
            min-height: calc(100vh - ${HeaderHeight});
          }
        `}
      >
        <Box
          height={`calc(100vh - ${HeaderHeight})`}
          maxHeight={`calc(100vh - ${HeaderHeight})`}
          position="relative"
          overflow="auto"
        >
          <SidebarToggleButton />
          {children}
        </Box>
        {/* <Footer /> */}
      </PageWithSidebar>
    </PageWithHeader>
  )
}

const SidebarToggleButton = () => {
  let { sidebar, isCollapsed } = usePage()
  //if (!isDev()) {
  return null
}

export const getSidebarWidth = () => {
  let sidebarWrapper = document.querySelector(
    "#pageWithSidebar .bb-PageWithSidebarSidebarExpandedWrapper"
  )
  return sidebarWrapper?.offsetWidth ?? sidebarWidth
}

const Header = () => {
  let userId = useUserId()
  let usename = useUsername()
  let deauth = useDeauth()
  let { collapseBelow, ...page } = usePage()

  let changePasswordDialog = useModalState()

  const logout = async () => {
    await deauth()
    localStorage.removeItem("selectedMerchant")
    location.replace(LoginPath)
  }

  let imgUrl = getHeaderImageUrl()
  // let title = getHeaderTitle()
  return (
    <>
      <TopNav id="app-header" background={getHeaderBackground()}>
        <TopNav.Section>
          <TopNav.Item marginRight="0">
            <Button
              paddingLeft="1rem"
              paddingRight="1rem"
              color={getHeaderButtonColor()}
              onClick={page.sidebar.toggle}
              variant="link"
              boxShadow="none"
            >
              <Icon
                icon="solid-bars"
                fontSize="300"
                color="rgba(8, 10, 12, 0.65)"
              />
            </Button>
          </TopNav.Item>
          <TopNav.Item marginLeft="-0.15rem">
            {imgUrl && <Image src={imgUrl} height="30px" filter="none" />}
            {/* {title && (
              <Text.Block
                lineHeight="normal"
                color={getHeaderTitleColor()}
                fontSize={getHeaderTitleFontSize()}
                fontWeight={getHeaderTitleFontWeight()}
                marginLeft="0.8rem"
              >
                {title}
              </Text.Block>
            )} */}
          </TopNav.Item>
        </TopNav.Section>
        <TopNav.Section marginRight="major-2">
          <FundDepositTopNavItem
            id="fund-deposit-notify"
            color={getHeaderButtonColor()}
            background={getHeaderButtonBackground()}
          />
          <FundWithdrawTopNavItem
            id="fund-withdraw-notify"
            color={getHeaderButtonColor()}
            background={getHeaderButtonBackground()}
          />
          <TopNav.Item>
            <DropdownMenu
              id="user-menu"
              menu={
                <>
                  <DropdownMenu.Item
                    id="change-password"
                    onClick={changePasswordDialog.show}
                  >
                    <ChangePasswordTrans />
                  </DropdownMenu.Item>
                  <DropdownMenu.Item id="logout" onClick={logout}>
                    <Trans zh="登出" en="Logout" />
                  </DropdownMenu.Item>
                </>
              }
              css={css`
                > div {
                  box-shadow: none !important;
                  border: 1px solid #ddd;
                  &:hover {
                    span {
                      color: rgba(37, 43, 54, 0.95);
                    }
                  }
                  span {
                    color: rgba(37, 43, 54, 0.95);
                    font-weight: 400;
                    font-size: 16px;
                  }
                }
              `}
            >
              <Button
                variant="link"
                textDecoration="none"
                // iconAfter="chevron-down"
                color="rgba(8, 10, 12, 0.65)"
                background={getHeaderButtonBackground()}
                padding="0 10px"
                fontWeight="400"
              >
                <Hide above={collapseBelow}>
                  <Icon icon="solid-user" />
                </Hide>
                <Hide below={collapseBelow}>
                  <span id="username">{usename}</span>
                </Hide>
                <Icon
                  icon="chevron-down"
                  fontSize="100"
                  marginLeft="10px"
                  marginTop="2px"
                />
              </Button>
            </DropdownMenu>
          </TopNav.Item>
          <LangItem />
        </TopNav.Section>
      </TopNav>
      {changePasswordDialog.visible && (
        <AdminUserChangePasswordDialog
          userId={userId}
          dialog={changePasswordDialog}
        />
      )}
    </>
  )
}

const LangItem = ({ ...props }) => {
  let { collapseBelow, ...page } = usePage()

  let locale = useLocale()
  let chinese = "中文"
  let english = "English"
  let vietnamese = "Tiếng Việt"
  let thai = "ไทย"

  let useEn = useEnglish()
  let useZh = useChinese()
  let useVi = useVietnamese()
  let useTh = useThai()
  return (
    <TopNav.Item {...props}>
      <DropdownMenu
        menu={
          <>
            <DropdownMenu.Item onClick={useZh}>{chinese}</DropdownMenu.Item>
            <DropdownMenu.Item onClick={useEn}>{english}</DropdownMenu.Item>
            <DropdownMenu.Item onClick={useVi}>{vietnamese}</DropdownMenu.Item>
            <DropdownMenu.Item onClick={useTh}>{thai}</DropdownMenu.Item>
          </>
        }
        css={css`
          > div {
            box-shadow: none !important;
            border: 1px solid #ddd;
            &:hover {
              div {
                color: rgba(37, 43, 54, 0.95);
              }
            }
            div {
              color: rgba(37, 43, 54, 0.95);
              font-weight: 400;
              font-size: 16px;
            }
          }
        `}
      >
        <Button
          variant="link"
          textDecoration="none"
          // iconAfter="chevron-down"
          color="rgba(8, 10, 12, 0.65)"
          background={getHeaderButtonBackground()}
          padding="0 10px"
          fontWeight="400"
        >
          <Hide above={collapseBelow}>
            <Icon icon="solid-language" fontSize="500" />
          </Hide>
          <Hide below={collapseBelow}>
            {locale === Locales.zh && chinese}
            {locale === Locales.en && english}
            {locale === Locales.vi && vietnamese}
            {locale === Locales.th && thai}
          </Hide>
          <Icon
            icon="chevron-down"
            fontSize="100"
            marginLeft="10px"
            marginTop="2px"
          />
        </Button>
      </DropdownMenu>
    </TopNav.Item>
  )
}

const Sidebar = () => {
  let { pathname: selectedId } = useLocation()
  let { isCollapsed, sidebar } = usePage()

  useEffect(() => {
    if (!isCollapsed) {
      sidebar.drawer.hide()
    }
  }, [isCollapsed])

  return (
    <SideNav
      id="sidebar"
      selectedId={selectedId}
      css={css`
        padding: 8px;
        background: #ffffff;
      `}
    >
      <AllMenus />
    </SideNav>
  )
}

const Footer = () => {
  return (
    <Box textAlign="center" height={FooterHeight}>
      <Text fontWeight="500" fontSize="150">
        version {import.meta.env.SNOWPACK_PUBLIC_VERSION}
      </Text>
    </Box>
  )
}

export default App
