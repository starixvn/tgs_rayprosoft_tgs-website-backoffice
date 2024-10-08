import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { useUpdatePlayer, toUpdatePlayerFormData } from "./client"
import {
  Spinner,
  Stack,
  Columns,
  Box,
  Set,
  Button,
  Text,
  Group,
  Heading,
  FieldStack
} from "bumbag"
import { FieldValues } from "../../layout/Grid"
import {
  Trans,
  FormattedDate,
  FormattedDateTime,
  FormattedNumber,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import { PlayerStatusSelect, PlayerStatusLabel } from "../PlayerStatus"
import { VipLevelSelect } from "../../vip-levels/VipLevelSelect"
import AlertDialog from "../../dialog/Alert"
import { SubmitCancel } from "../../button/ActionButtons"
import { Tab as _Tab, TabPanel } from "../../tab"
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch
} from "react-hook-form"
import Input from "../../input/Input"
import clone from "clone-deep"
import { VipLevelLabel } from "../../vip-levels/VipLevel"
import { PlayerClearWageringRequirementDisclosure } from "./PlayerClearWageringRequirement"
import { EditIdNumber } from "./menu"
import { useIsAdminUser, useIsDisplayMenuByRoute } from "../../user/context"
import { isDev } from "../../env"
import { DateInput } from "../../date/DateInput"
import Textarea from "../../textarea"
import { isValid, parse } from "date-fns"
import { defaultFormatDate } from "../../date/format"
import { PlayerIdentityStateIcon } from "../player-identity/PlayerIdentityState"
import { PlayerBucketListDialogDisclosure } from "./PlayerBucketList"
import { diff } from "../../object/diff"
import {
  AgentTrans,
  UpperLevelAgentTrans,
  useAgentUsernameTrans
} from "../../trans/Agent"
import {
  BalanceTrans,
  BirthdayTrans,
  ICNumberTrans,
  LastLoginIPTrans,
  LastLoginTimeTrans,
  RealNameTrans,
  RegisterIPTrans,
  RegistrationTimeTrans,
  UserNameTrans
} from "../../trans/User"
import {
  AccountTypeTrans,
  PlayerCodeTrans,
  PlayerInfoTrans,
  PlayerTrans,
  RegistrationDomainTrans,
  WageringRequirementTrans
} from "../../trans/Player"
import { StatusTrans } from "../../trans/Status"
import {
  CurrentVipLevelTrans,
  VipAccumulationStatusTrans,
  VipLevelTrans,
  VipTotalDepositTrans,
  VipTotalValidBetTrans,
  VipUpgradeTrans
} from "../../trans/Vip"
import { RemarkTrans } from "../../trans/Action"
import {
  TotalDepositAmountTrans,
  TotalWithdrawAmountTrans
} from "../../trans/Field"
import {
  AutoOrManualSwitch,
  AutoOrManualSwitchLabel
} from "../../switch/AutoOrManualSwitch"
import { spacingForm } from "../../styles/spacing"
import CustomToolTip from "../../text/CustomToolTip"

export const PlayerInfoKey = "player"

export const PlayerInfoTab = ({ ...props }) => {
  return (
    <_Tab tabId={PlayerInfoKey} {...props}>
      <PlayerInfoTrans />
    </_Tab>
  )
}

export const PlayerInfoEditPanel = (props) => {
  return <UpdatePlayerInfoPanel {...props} />
}

const UpdatePlayerInfoPanel = ({
  brandId,
  brand,
  playerCode = "",
  player,
  showParentUsername,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let defaultValues = clone({
    ...player,
    birthdate: parse(player?.birthdate ?? "", "yyyy/MM/dd", new Date())
  })

  let formMethods = useForm({
    defaultValues
  })

  let [submitData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useUpdatePlayer(
    playerCode,
    submitData
  )

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result])

  const onSubmit = ({
    birthdate,
    wageringRequirement: _,
    banks,
    fullLevel,
    nextVipLevel,
    nextVipLevelId,
    ...data
  } = {}) => {
    //drop wageringRequirement, banks, fullLevel, nextVipLevel, nextVipLevelId  not updatable value

    birthdate = isValid(birthdate) ? defaultFormatDate(birthdate) : null

    let formData = diff(
      {
        birthdate,
        ...data
      },
      player
    )
    setSubmit(toUpdatePlayerFormData(formData))
  }

  return (
    <TabPanel tabId={PlayerInfoKey} {...props}>
      {error && <AlertDialog {...error} onClickClose={reset} />}
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <EditForm
            brandId={brandId}
            brand={brand}
            playerCode={playerCode}
            player={player}
            showParentUsername={showParentUsername}
            isLoading={isLoading}
            onClickClose={() => {
              reset()
              onClickClose?.()
            }}
          />
        </form>
      </FormProvider>
    </TabPanel>
  )
}

const PlayerIdNumberInputGroup = ({ player, showIdentityAuth }) => {
  let editable = useIsDisplayMenuByRoute([EditIdNumber])
  let disabled = !editable

  return (
    <Group>
      <Input
        name="idNumber"
        defaultValue={player?.idNumber}
        disabled={disabled}
        readOnly={disabled}
      />
      {showIdentityAuth && player.idNumber && (
        <Button disabled>
          <PlayerIdentityStateIcon value={player.identityAuthentication} />
        </Button>
      )}
    </Group>
  )
}

const AccountTypeBox = ({ player }) => {
  return (
    <>
      <Text fontWeight="bold">
        <AccountTypeTrans />
      </Text>

      {!!player?.upgradePlayerAgentId ? <AgentTrans /> : <PlayerTrans />}
    </>
  )
}

const EditForm = ({
  brandId,
  brand,
  playerCode = "",
  player = {},
  showParentUsername,
  isLoading,
  onClickClose,
  ...props
}) => {
  let { control, setValue } = useFormContext()
  let isAdmin = useIsAdminUser()
  let agentUsernamePlaceholder = useAgentUsernameTrans()

  let allAgentUpperLevelPlaceholder = useTrans({
    zh: "全民代理上級",
    en: "All Agent Upper Level"
  })

  const WageringRequirementFieldName = "wageringRequirement"
  let wageringRequirement = useWatch({
    control,
    name: WageringRequirementFieldName
  })

  const VipUpgradeField = "vipLevelAutoState"

  let { username = "", registeredOn, balance } = player

  return (
    <Stack>
      <FieldValues
        css={css`
          gap: 16px 24px;
          margin-bottom: 10px !important;
          .react-datepicker-wrapper,
          .bb-InputWrapper,
          .bb-Select,
          .bb-SelectWrapper,
          select,
          input,
          textarea {
            width: 100%;
          }
        `}
      >
        {isAdmin && (
          <>
            <Text fontWeight="bold">
              <PlayerCodeTrans />
            </Text>
            <Text>{player.playerCode}</Text>
          </>
        )}
        <Text fontWeight="bold">
          <UserNameTrans />
        </Text>
        <Text>{username}</Text>
        <Text fontWeight="bold">
          <RealNameTrans />
        </Text>
        <Box>
          <Input name="realName" />
        </Box>
        <Text fontWeight="bold">
          <BirthdayTrans />
        </Text>
        <Box>
          <DateInput
            name="birthdate"
            css={css`
              &. bb-Box {
                width: 100%;
              }
              > input {
                width: 100%;
                &:focus {
                  box-shadow: none !important;
                }
              }
            `}
          />
        </Box>
        <Text fontWeight="bold">
          <ICNumberTrans />
        </Text>
        <PlayerIdNumberInputGroup
          player={player}
          showIdentityAuth={brand?.enablePlayerIdentity}
        />
        <Text fontWeight="bold">
          <VipLevelTrans />
        </Text>
        <Box>
          <VipLevelSelect
            name="vipId"
            defaultValue={player?.vipId}
            required
            brandId={brandId}
            disabled
          />
        </Box>
        <Text fontWeight="bold">
          <VipUpgradeTrans />
        </Text>
        <AutoOrManualSwitch disabled name={VipUpgradeField} {...props} />
        <Text fontWeight="bold">
          <UpperLevelAgentTrans />
        </Text>
        <Box>
          <Input
            name="agentUsername"
            placeholder={agentUsernamePlaceholder}
            disabled
          />
        </Box>
        {showParentUsername && (
          <>
            <Text fontWeight="bold">
              <AllAgentUpperLevelLabel />
            </Text>

            <Box>
              <Input
                name="parentUsername"
                placeholder={allAgentUpperLevelPlaceholder}
              />
            </Box>
          </>
        )}
        <Text fontWeight="bold">
          <RegistrationTimeTrans />
        </Text>
        <Box>
          <FormattedDateTime value={registeredOn} />
        </Box>
        <Text fontWeight="bold">
          <BalanceTrans />
        </Text>
        <Box>
          <FormattedNumberDecimal value={balance} />
        </Box>
        <Box alignY="center">
          <Text fontWeight="bold">
            <WageringRequirementTrans />
          </Text>
        </Box>
        <Set
          css={css`
            .bb-Box {
              width: auto !important;
            }
          `}
        >
          <FormattedNumberDecimal value={wageringRequirement} />
          <Input type="hidden" name={WageringRequirementFieldName} />
          <PlayerClearWageringRequirementDisclosure
            id="clear-player-wagering-requirement-dialog-disclosure"
            disabled
            playerCode={player?.playerCode}
            onSubmitted={() => {
              setValue(WageringRequirementFieldName, 0)
            }}
          />
        </Set>
        <Text fontWeight="bold">
          <StatusTrans />
        </Text>
        <Box>
          <PlayerStatusSelect name="status" required placeholder={false} />
        </Box>
        <Text fontWeight="bold">
          <RemarkTrans />
        </Text>
        <Box>
          <Textarea
            name="remark"
            css={css`
              > textarea {
                border-radius: 6px;
                &:focus {
                  box-shadow: none !important;
                }
              }
            `}
          />
        </Box>
      </FieldValues>
      <Box alignX="right">
        <SubmitCancel onClickCancel={onClickClose} isLoading={isLoading} />
      </Box>
    </Stack>
  )
}

export const PlayerInfoPanel = ({
  player = {},
  brand,
  showParentUsername,
  onSubmitted,
  ...props
}) => {
  let isAdmin = useIsAdminUser()
  let {
    username = "",
    realName = "",
    vipLevel = "",
    registeredOn,
    balance,
    status,
    playerPayment,
    vipLevelAutoState
  } = player
  // Set Vip Upgrade method to manual
  vipLevelAutoState = 0

  return (
    <TabPanel tabId={PlayerInfoKey} {...props}>
      <Columns>
        <Columns.Column spread={5}>
          <FieldValues css={spacingForm}>
            {isAdmin && (
              <>
                <Text fontWeight="bold">
                  <PlayerCodeTrans />
                </Text>
                <Text>{player.playerCode}</Text>
              </>
            )}
            <Text fontWeight="bold">
              <UserNameTrans />
            </Text>
            <Text data-field="username">{username}</Text>
            <Text fontWeight="bold">
              <RealNameTrans />
            </Text>
            <CustomToolTip text={realName} placement="bottom" maxLength={30} />
            <Text fontWeight="bold">
              <BirthdayTrans />
            </Text>
            <Box>
              <FormattedDate
                value={parse(player?.birthdate, "yyyy/MM/dd", new Date())}
              />
            </Box>
            <Text fontWeight="bold">
              <ICNumberTrans />
            </Text>
            <Set orientation="horizontal" alignY="center">
              <Text.Block>{player.idNumber}</Text.Block>
              {brand?.enablePlayerIdentity && player.idNumber && (
                <PlayerIdentityStateIcon
                  value={player.identityAuthentication}
                />
              )}
            </Set>

            <AccountTypeBox player={player} />
            <Text fontWeight="bold">
              <UpperLevelAgentTrans />
            </Text>

            <Box>
              <Text>{player?.agentUsername}</Text>
            </Box>

            {showParentUsername && (
              <>
                <AllAgentUpperLevelLabel />
                <Box>
                  <Text>{player?.parentUsername}</Text>
                </Box>
              </>
            )}
            <Text fontWeight="bold">
              <BalanceTrans />
            </Text>

            <Box>
              <FormattedNumberDecimal value={balance} />
            </Box>

            <Box alignY="center">
              <Text fontWeight="bold">
                <WageringRequirementTrans />
              </Text>
            </Box>
            <Set>
              <FormattedNumberDecimal value={player?.wageringRequirement} />
              <PlayerBucketListDialogDisclosure
                disabled
                playerCode={player.playerCode}
              />
            </Set>
            <Text fontWeight="bold">
              <StatusTrans />
            </Text>
            <Box>
              <PlayerStatusLabel value={status} />
            </Box>
            <Text fontWeight="bold">
              <RemarkTrans />
            </Text>
            <Box>
              <Text>{player?.remark}</Text>
            </Box>
            <Text fontWeight="bold">
              <RegisterIPTrans />
            </Text>
            <Box>{player?.registerIp}</Box>
            <Text fontWeight="bold">
              <RegistrationTimeTrans />
            </Text>
            <Box>
              <FormattedDateTime value={registeredOn} />
            </Box>
            <Text fontWeight="bold">
              <LastLoginTimeTrans />
            </Text>
            <Box>
              <FormattedDateTime value={player?.lastLoginOn} />
            </Box>
            <Text fontWeight="bold">
              <LastLoginIPTrans />
            </Text>
            <Box>{player?.lastLoginIp}</Box>
            <Text fontWeight="bold">
              <RegistrationDomainTrans />
            </Text>
            <Box>{player?.registerHost}</Box>
            <Text fontWeight="bold">
              <TotalDepositAmountTrans />
            </Text>

            <FormattedNumberDecimal value={playerPayment?.totalDepositAmount} />
            <Text fontWeight="bold">
              <TotalWithdrawAmountTrans />
            </Text>
            <FormattedNumberDecimal
              value={playerPayment?.totalWithdrawAmount}
            />
          </FieldValues>
        </Columns.Column>
        <Columns.Column spread={5}>
          <Heading use="h5" marginBottom="major-2">
            <VipAccumulationStatusTrans />
          </Heading>
          <FieldValues
            css={css`
              gap: 16px 24px;
            `}
          >
            <Text fontWeight="bold">
              <VipUpgradeTrans />
            </Text>
            <AutoOrManualSwitchLabel value={vipLevelAutoState} />
            <Text fontWeight="bold">
              <CurrentVipLevelTrans />
            </Text>
            <VipLevelLabel value={vipLevel} />
            <Text fontWeight="bold">
              <VipTotalValidBetTrans />
            </Text>
            <Set orientation="horizontal" alignY="center">
              <FormattedNumberDecimal value={player.accumTurnover} />
              <Box>/</Box>
              <FormattedNumberDecimal
                value={player.levelUpAccumulateBetAmount}
              />
            </Set>
            <Text fontWeight="bold">
              <VipTotalDepositTrans />
            </Text>
            <Set orientation="horizontal" alignY="center">
              <FormattedNumberDecimal value={player.accumDeposit} />
              <Box>/</Box>
              <FormattedNumberDecimal value={player.levelUpAccumulateDeposit} />
            </Set>
          </FieldValues>
        </Columns.Column>
      </Columns>
    </TabPanel>
  )
}

const AllAgentUpperLevelLabel = () => (
  <Text fontWeight="bold">
    <Trans zh="全民代理上級" en="All Agent Upper Level" />
  </Text>
)
