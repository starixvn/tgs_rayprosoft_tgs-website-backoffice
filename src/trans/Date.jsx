import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"
import getTrans from "./getTrans"

const Time = {
  ...getTrans("Date.Time"),
  zh: "时间",
  en: "Time",
  vi: "Thời gian"
}
export const TimeTrans = () => <Trans {...Time} />

const Yesterday = {
  ...getTrans("Date.Yesterday"),
  zh: "昨日",
  en: "Yesterday",
  vi: "Hôm qua"
}
export const useYesterdayTrans = () => useTrans(Yesterday)
export const YesterdayTrans = () => <Trans {...Yesterday} />

const Today = {
  ...getTrans("Date.Today"),
  zh: "今日",
  en: "Today",
  vi: "Hôm nay"
}
export const useTodayTrans = () => useTrans(Today)
export const TodayTrans = () => <Trans {...Today} />

const LastWeek = {
  ...getTrans("Date.LastWeek"),
  zh: "上周",
  en: "Last Week",
  vi: "Tuần trước"
}
export const useLastWeekTrans = () => useTrans(LastWeek)
export const LastWeekTrans = () => <Trans {...LastWeek} />

const ThisWeek = {
  ...getTrans("Date.ThisWeek"),
  zh: "本周",
  en: "This Week",
  vi: "Tuần này"
}
export const useThisWeekTrans = () => useTrans(ThisWeek)
export const ThisWeekTrans = () => <Trans {...ThisWeek} />

const LastMonth = {
  ...getTrans("Date.LastMonth"),
  zh: "上月",
  en: "Last Month",
  vi: "Tháng trước"
}
export const useLastMonthTrans = () => useTrans(LastMonth)
export const LastMonthTrans = () => <Trans {...LastMonth} />

const ThisMonth = {
  ...getTrans("Date.ThisMonth"),
  zh: "本月",
  en: "This Month",
  vi: "Tháng này"
}
export const useThisMonthTrans = () => useTrans(ThisMonth)
export const ThisMonthTrans = () => <Trans {...ThisMonth} />

const ApplicationTime = {
  ...getTrans("Date.ApplicationTime"),
  zh: "申请时间",
  en: "Application Time",
  vi: "Thời gian nộp đơn"
}
export const ApplicationTimeTrans = () => <Trans {...ApplicationTime} />

const CreatedTime = {
  ...getTrans("Date.CreatedTime"),
  zh: "创建时间",
  en: "Created Time",
  vi: "Thời gian lập"
}
export const CreatedTimeTrans = () => <Trans {...CreatedTime} />

const UpdatedTime = {
  ...getTrans("Date.UpdatedTime"),
  zh: "更新时间",
  en: "Updated Time",
  vi: "Thời gian cập nhật"
}
export const UpdatedTimeTrans = () => <Trans {...UpdatedTime} />

const SentOn = {
  ...getTrans("Date.SentOn"),
  zh: "派发时间",
  en: "Sent On",
  vi: "Thời gian phân phát"
}
export const SentOnTrans = () => <Trans {...SentOn} />

const ParticipationTime = {
  ...getTrans("Date.ParticipationTime"),
  zh: "参加时间",
  en: "Participation Time",
  vi: "Thời gian tham gia"
}
export const ParticipationTimeTrans = () => <Trans {...ParticipationTime} />

const VerifiedTime = {
  ...getTrans("Date.VerifiedTime"),
  zh: "审核时间",
  en: "Verified",
  vi: "Thời gian xem xét"
}
export const VerifiedTimeTrans = () => <Trans {...VerifiedTime} />
export const useVerifiedTimeTrans = () => <Trans {...VerifiedTime} />

const PeriodicMaintenanceTime = {
  ...getTrans("Date.PeriodicMaintenanceTime"),
  zh: "定期维护时间",
  en: "Periodic Maintenance Time",
  vi: "Thời gian bảo trì định kỳ"
}
export const PeriodicMaintenanceTimeTrans = () => (
  <Trans {...PeriodicMaintenanceTime} />
)

const StartTime = {
  ...getTrans("Date.StartTime"),
  zh: "开始时间",
  en: "Start Time",
  vi: "Thời gian bắt đầu"
}
export const StartTimeTrans = () => <Trans {...StartTime} />

const EndTime = {
  ...getTrans("Date.EndTime"),
  zh: "结束时间",
  en: "End Time",
  vi: "Thời gian kết thúc"
}
export const EndTimeTrans = () => <Trans {...EndTime} />

const Weekly = {
  ...getTrans("Date.Weekly"),
  zh: "每周",
  en: "Weekly",
  vi: "Mỗi tuần"
}
export const WeeklyTrans = () => <Trans {...Weekly} />
