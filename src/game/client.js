import { urlWith, useGet, usePostData, usePutData, useDelete } from "../client"
import GameType, { GameTypeGroupSelect } from "./GameType"

export const useGameTypeGroupList = () => {
  let data = [
    {
      name: "LiveDealer",
      items: [GameType.LiveDealer, GameType.LiveDealerLobby]
    },
    {
      name: "Sports",
      items: [GameType.Sportsbook, GameType.ESports]
    },
    {
      name: "EGame",
      items: [
        GameType.Slot,
        GameType.Fishing,
        GameType.FishingLobby,
        GameType.Arcade,
        GameType.ArcadeLobby,
        GameType.TableGame
      ]
    },
    {
      name: "CardGame",
      items: [GameType.CardGame, GameType.CardGameLobby]
    },
    {
      name: "VirtualSports",
      items: [GameType.VirtualSports, GameType.VirtualSportsLobby]
    },
    {
      name: "Lottery",
      items: [GameType.Lottery, GameType.LotteryLobby]
    },
    {
      name: "CockFighting",
      items: [GameType.CockFighting]
    },
    {
      name: "InstantPlay",
      items: [GameType.InstantPlay]
    },
    {
      name: "Casino",
      items: [GameType.Casino]
    },
    {
      name: "Keno",
      items: [GameType.Keno]
    },
    {
      name: "Bingo",
      items: [GameType.Bingo]
    },
    {
      name: "Racing",
      items: [GameType.Racing]
    }
  ]

  return {
    data,
    error: undefined,
    isLoading: false,
    mutate: () => {},
    deleteCache: () => {}
  }
}
