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
export const API = `${apiUrl}/api/MarketReport`

export const useMarketReportList = (searchParams) => {
    let url = searchParams ? urlWith(searchParams, API) : ""
    return useGet(url)
}

export const usePlatformMarketReportAdditionalExpenseList = (searchParams) => {
    let url = searchParams
        ? urlWith(searchParams, `${API}/additionalExpenses`)
        : ""
    return useGet(url)
}

export const useMarketReportAgentProfitList = (searchParams) => {
    let url =
        searchParams?.brandId && searchParams?.date
            ? urlWith(searchParams, `${API}/agentProfit`)
            : ""
    return useGet(url)
}
