import {
  Box,
  Card,
  Code,
  Dialog,
  FieldStack,
  FieldWrapper,
  Text,
  useModalState
} from "bumbag"
import React from "react"
import { DetailDisclosure } from "../dialog/Disclosure"
import { JsonEditor } from "../text/editor/JsonEditor"
import { tryStringifyJSON } from "../text/json"
import { useDetailTrans } from "../trans/Action"

export const LogDetailDialogDisclosure = ({ record, ...props }) => {
  let dialog = useModalState()

  return (
    <>
      <DetailDisclosure {...dialog} />
      {dialog.visible && <DetailDialog record={record} dialog={dialog} />}
    </>
  )
}

const DetailDialog = ({ record = {}, dialog, isAdminLog, ...props }) => {
  const title = useDetailTrans()

  let [isRequestJson, requestContent = ""] = tryStringifyJSON(
    record.requestContent
  )

  let [isResponseJson, responseContent = ""] = tryStringifyJSON(
    record.responseContent
  )
  return (
    <Dialog.Modal
      title={title}
      showActionButtons={false}
      hideOnClickOutside={false}
      showCloseButton
      width="80vw"
      maxWidth="80vw"
      {...dialog}
    >
      <FieldStack orientation="vertical">
        {record.description ? (
          <Card variant="bordered" title="Description">
            <Text.Block>{record.description}</Text.Block>
          </Card>
        ) : null}
        <Card variant="bordered" title="Request">
          <FieldStack>
            <FieldWrapper label="Headers">
              <Code isBlock>{record.requestHeaders}</Code>
            </FieldWrapper>
            <FieldWrapper label="Content">
              <Box>
                {isRequestJson && (
                  <JsonEditor height="30vh" value={requestContent} disabled />
                )}
                {!isRequestJson && (
                  <Code isBlock wordBreak="break-word">
                    {requestContent}
                  </Code>
                )}
              </Box>
            </FieldWrapper>
          </FieldStack>
        </Card>

        <Card variant="bordered" title="Response">
          <FieldStack>
            <FieldWrapper label="Headers">
              <Code isBlock>{record.responseHeaders}</Code>
            </FieldWrapper>
            <FieldWrapper label="Content">
              <Box>
                {isResponseJson && (
                  <JsonEditor height="30vh" value={responseContent} disabled />
                )}
                {!isResponseJson && (
                  <Code isBlock wordBreak="break-word">
                    {responseContent}
                  </Code>
                )}
              </Box>
            </FieldWrapper>
          </FieldStack>
        </Card>
      </FieldStack>
    </Dialog.Modal>
  )
}

export default DetailDialog
