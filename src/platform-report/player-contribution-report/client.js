import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData,
  getApiUrl
} from "../../client"

const apiUrl = getApiUrl()
export const API = `${apiUrl}/api/PlayerReport`

export const usePlayerContributionList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/contribution`) : ""
  return useGet(url)
}
