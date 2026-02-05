import { List, ActionPanel, Action, Icon, ToastStyle, showToast, getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import { getBots } from "./utils/api";

interface Preferences {
  asfUrl: string;
  ipcPassword?: string;
}

export default function Command() {
  const [bots, setBots] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBots() {
      setIsLoading(true);
      setError(null);
      try {
        const botsData = await getBots();
        setBots(botsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }
    loadBots();
  }, []);

  // Get all card drops across all bots
  const allDrops: Array<{
    botName: string;
    appId: number;
    gameName: string;
    cardsRemaining: number;
    timeRemaining: string;
  }> = [];

  Object.entries(bots).forEach(([botName, bot]) => {
    if (bot.CardsFarmer?.CurrentGamesFarming) {
      bot.CardsFarmer.CurrentGamesFarming.forEach((game: any) => {
        allDrops.push({
          botName,
          appId: game.AppID,
          gameName: game.GameName,
          cardsRemaining: game.CardsRemaining,
          timeRemaining: bot.CardsFarmer?.TimeRemaining || "Unknown",
        });
      });
    }
  });

  // Sort by cards remaining (fewest first)
  allDrops.sort((a, b) => a.cardsRemaining - b.cardsRemaining);

  // Calculate stats
  const totalDrops = allDrops.reduce((sum, drop) => sum + drop.cardsRemaining, 0);
  const uniqueGames = new Set(allDrops.map((d) => `${d.appId}-${d.gameName}`)).size;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search card drops..."
      throttle
    >
      {error && <List.EmptyView icon={Icon.Warning} title="Error" description={error} />}

      {!isLoading && allDrops.length === 0 && !error && (
        <List.EmptyView
          icon={Icon.Box}
          title="No Card Drops Found"
          description="Start farming games to track card drops"
        />
      )}

      {allDrops.length > 0 && (
        <>
          <List.Section title="Drop Summary">
            <List.Item
              title="Total Cards Remaining"
              icon={Icon.Star}
              accessories={[{ text: `${totalDrops} cards` }]}
            />
            <List.Item
              title="Games Being Farmed"
              icon={Icon.GameController}
              accessories={[{ text: `${uniqueGames} games` }]}
            />
            <List.Item
              title="Active Bots"
              icon={Icon.CircleProgress}
              accessories={[{ text: `${Object.keys(bots).length} bots` }]}
            />
          </List.Section>

          <List.Section title="🃏 Card Drops" subtitle={`${allDrops.length} drops`}>
            {allDrops.map((drop) => (
              <List.Item
                key={`${drop.botName}-${drop.appId}`}
                title={drop.gameName}
                subtitle={`Bot: ${drop.botName}`}
                accessories={[
                  { text: `${drop.cardsRemaining} cards`, icon: Icon.Star },
                  { text: drop.timeRemaining, icon: Icon.Clock },
                ]}
                actions={
                  <ActionPanel>
                    <Action.OpenInBrowser
                      title={`View on Steam Store`}
                      url={`https://store.steampowered.com/app/${drop.appId}`}
                      icon={Icon.Link}
                    />
                  </ActionPanel>
                }
              />
            ))}
          </List.Section>
        </>
      )}
    </List>
  );
}
