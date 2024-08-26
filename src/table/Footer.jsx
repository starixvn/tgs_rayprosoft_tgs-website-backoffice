import { css } from "@emotion/react"
import { Pagination, Select, Set, Text } from "bumbag"
import React, { forwardRef } from "react"
import { Trans } from "../i18n"
import { formatNumber } from "../number/format"
import { useNextPageTrans, usePreviousPageTrans } from "../trans/Action"

export const Footer = forwardRef(
  ({ table, setPageIndex, setPageSize }, ref) => {
    let previousText = usePreviousPageTrans()

    let nextText = useNextPageTrans()

    // TODO: how to measure height + margin?
    // let [paginationRef, paginationMeasure] = useMeasure()

    let { pageCount, totalCount, state, gotoPage } = table

    let infos = [pageCount, totalCount].filter(Number.isFinite)
    let noFooter = infos.length === 0

    if (noFooter) {
      return null
    }

    const getPage = () => state.pageIndex + 1
    const getPageSize = () => state.pageSize

    const handlePageSizeChange = (event) => {
      setPageSize(Number(event.target.value))
      let pageIndex = 0
      setPageIndex(pageIndex)

      gotoPage(pageIndex)
    }
    const pageSizeSelect = setPageSize ? (
      <Select
        value={getPageSize()}
        defaultValue={20}
        onChange={handlePageSizeChange}
        options={[
          { label: "10", value: 10 },
          { label: "20", value: 20 },
          { label: "50", value: 50 },
          { label: "100", value: 100 },
          { label: "500", value: 500 }
        ]}
      />
    ) : null

    let formattedTotalCount = formatNumber(totalCount)
    return (
      <Set
        ref={ref}
        orientation="horizontal"
        verticalBelow="mobile"
        alignY="center"
        css={css`
          margin-bottom: 0.75rem;
        `}
      >
        {pageCount > 0 && (
          <>
            <Pagination
              // ref={paginationRef}
              previousText={previousText}
              nextText={nextText}
              currentPage={getPage()}
              onChangePage={(page) => {
                let pageIndex = page - 1
                setPageIndex(pageIndex)

                gotoPage(pageIndex)
              }}
              numberOfPages={pageCount}
              marginTop="0"
              marginLeft="0"
              css={css`
                width: max-content;
                z-index: 0;
              `}
            />
            {pageSizeSelect}
          </>
        )}
        {Number.isFinite(totalCount) && (
          <Text>
            <Trans
              zh={`笔数：${formattedTotalCount}`}
              en={`Rows：${formattedTotalCount}`}
            />
          </Text>
        )}
      </Set>
    )
  }
)
