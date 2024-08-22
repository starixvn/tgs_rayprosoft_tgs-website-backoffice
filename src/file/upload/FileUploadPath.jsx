//export const FileUploadPath = "/fs/file/uploadFileS3"

import { getApiUrl } from "../../client"

export const toFileUploadPath = (prefix) => {
  const apiUrl = getApiUrl()
  return `${apiUrl}/api/fs/upload/${prefix}`
}
