import {
    urlWith,
    useGet,
    usePostData,
    usePutData,
    useDelete,
    getApiUrl
} from "../../client"

const apiUrl = getApiUrl()
export let API = `${apiUrl}/api/deposit`

export const useFundDepositFormList = (brandId, searchParams, options) => {
    let url =
        brandId && searchParams ? urlWith(searchParams, `${API}/${brandId}`) : ""
    return useGet(url, options)
}

export const useFundDepositForm = (brandId, formId) => {
    let url = brandId && formId ? `${API}/${brandId}/${formId}` : ""
    let { data, ...rest } = useGet(url)

    return {
        data: data?.data,
        ...rest
    }
}

export const useVerifyFundDepositForm = (brandId, formId, formData) => {
    let url = brandId && formId && formData ? `${API}/${formId}` : ""

    return usePostData(url, formData)
}

export const useUnprocessedFundDepositForm = (brandId, options) => {
    let url = brandId ? `${API}/untreated/${brandId}` : ""
    return useGet(url, options)
}
