import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"
import getTrans from "./getTrans"

const Status = {
  ...getTrans("Status.Status"),
  zh: "状态",
  en: "Status",
  vi: "Trạng thái"
}
export const StatusTrans = () => <Trans {...Status} />
export const useStatusTrans = () => useTrans(Status)

const InBlacklist = {
  ...getTrans("Status.InBlacklist"),
  zh: "黑名单",
  en: "In Blacklist",
  vi: "Danh sách đen"
}
export const useInBlacklistTrans = () => useTrans(InBlacklist)
export const InBlacklistTrans = () => <Trans {...InBlacklist} />

const Review = {
  ...getTrans("Status.Review"),
  zh: "审核中",
  en: "Review",
  vi: "Đang xét duyệt"
}
export const ReviewTrans = (props) => <Trans {...Review} {...props} />
export const useReviewTrans = () => useTrans(Review)

const Approved = {
  ...getTrans("Status.Approved"),
  zh: "已通过",
  en: "Approved",
  vi: "Đã thông qua"
}
export const ApprovedTrans = (props) => <Trans {...Approved} {...props} />
export const useApprovedTrans = () => useTrans(Approved)

const Distributed = {
  ...getTrans("Status.Distributed"),
  zh: "已派发",
  en: "Distributed",
  vi: "đã phân phát"
}
export const DistributedTrans = () => <Trans {...Distributed} />
export const useDistributedTrans = () => useTrans(Distributed)

const Rejected = {
  ...getTrans("Status.Rejected"),
  zh: "已拒绝",
  en: "Rejected",
  vi: "Đã từ chối"
}
export const RejectedTrans = (props) => <Trans {...Rejected} {...props} />
export const useRejectedTrans = () => useTrans(Rejected)

const Invalid = {
  ...getTrans("Status.Invalid"),
  zh: "无效",
  en: "Invalid",
  vi: "Không hợp lệ"
}
export const InvalidTrans = (props) => <Trans {...Invalid} {...props} />
export const useInvalidTrans = () => useTrans(Invalid)

const Published = {
  ...getTrans("Status.Published"),
  zh: "已发布",
  en: "Published",
  vi: "Được phát hành"
}
export const PublishedTrans = () => <Trans {...Published} />

const NoSearchResult = {
  ...getTrans("Status.NoSearchResult"),
  zh: "查无资料",
  en: "No Search Result",
  vi: "Không tìm thấy dữ liệu/Không có thông tin"
}
export const NoSearchResultTrans = () => <Trans {...NoSearchResult} />

const Automatic = {
  ...getTrans("Status.Automatic"),
  zh: "自动",
  en: "Auto",
  vi: "Thủ công"
}
export const AutoTrans = () => <Trans {...Automatic} />
export const useAutoTrans = () => useTrans(Automatic)

const Manual = {
  ...getTrans("Status.Manual"),
  zh: "手动",
  en: "Manual",
  vi: "Tự động"
}
export const ManualTrans = () => <Trans {...Manual} />
export const useManualTrans = () => useTrans(Manual)

const Enabled = {
  ...getTrans("Status.Enabled"),
  zh: "开启",
  en: "Enabled",
  vi: "Mở / Bật"
}
export const EnabledTrans = (props) => <Trans {...Enabled} {...props} />
export const useEnabledTrans = () => useTrans(Enabled)

const Disabled = {
  ...getTrans("Status.Disabled"),
  zh: "关闭",
  en: "Disabled",
  vi: "Đóng / Tắt"
}
export const DisabledTrans = (props) => <Trans {...Disabled} {...props} />
export const useDisabledTrans = () => useTrans(Disabled)

//TODO: only Disabled or Inactive?
const Inactive = {
  ...getTrans("Status.Inactive"),
  zh: "关闭",
  en: "Inactive",
  vi: "Đóng / Tắt"
}
export const InactiveTrans = () => <Trans {...Inactive} />

const Effective = {
  ...getTrans("Status.Effective"),
  zh: "有效",
  en: "Effective",
  vi: "Có hiệu lực"
}
export const EffectiveTrans = () => <Trans {...Effective} />

const Expired = {
  ...getTrans("Status.Expired"),
  zh: "过期",
  en: "Expired",
  vi: "Quá hạn"
}
export const ExpiredTrans = () => <Trans {...Expired} />

const ConfigStatus = {
  ...getTrans("Status.ConfigStatus"),
  zh: "配置状态",
  en: "Config Status",
  vi: "Trạng  thái thiết bị"
}
export const ConfigStatusTrans = () => <Trans {...ConfigStatus} />
export const useConfigStatusTrans = () => useTrans(ConfigStatus)

const Liable = {
  ...getTrans("Status.Liable"),
  zh: "承担",
  en: "Liable",
  vi: "đảm nhận"
}
export const LiableTrans = () => <Trans {...Liable} />
export const useLiableTrans = () => useTrans(Liable)

const NotLiable = {
  ...getTrans("Status.NotLiable"),
  zh: "不承担",
  en: "Not liable",
  vi: "không đảm nhận"
}
export const NotLiableTrans = () => <Trans {...NotLiable} />
export const useNotLiableTrans = () => useTrans(NotLiable)
