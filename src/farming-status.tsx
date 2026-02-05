import { List, ActionPanel, Action, Icon, ToastStyle, showToast, getPreferenceValues } from "@raycast/api";
import { useState, useEffect, useCallback } from "react";
import { getBots, getOneBot } from "./utils/api";

interface Preferences {
  asfUrl: string;
  ipcPassword?: string;
}

export default function Command() {
  const [bots, setBots] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadBots = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadBots();
  }, [loadBots]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadBots();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, loadBots]);

  const toggleAutoRefresh = () => {
    setAutoRefresh((prev) => !prev);
    showToast({
      style: ToastStyle.Success,
      title: autoRefresh ? "Auto-refresh Disabled" : "Auto-refresh Enabled",
    });
  };

  // Flatten bots into array for display
  const botList = Object.entries(bots);

  // Calculate farming summary
  const farmingBots = botList.filter(
    ([, bot]) =>
      bot.CardsFarmer &&
      bot.CardsFarmer.CurrentGamesFarming &&
      bot.CardsFarmer.CurrentGamesFarming.length > 0
  );

  const totalCardsRemaining = farmingBots.reduce((sum, [, bot]) => {
    return (
      sum +
      (bot.CardsFarmer?.CurrentGamesFarming?.reduce((gameSum: number, game: any) => gameSum + (game.CardsRemaining || 0), 0) || 0)
    );
  }, 0);

  const pausedBots = botList.filter(([, bot]) => bot.CardsFarmer?.Paused);
  const activeBots = botList.filter(([, bot]) => bot.IsConnectedAndLoggedOn && !bot.CardsFarmer?.Paused);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search farming status..."
      throttle
      actions={
        <ActionPanel>
          <Action
            title={autoRefresh ? "Disable Auto-refresh" : "Enable Auto-refresh"}
            icon={Icon.ArrowClockwise}
            onAction={toggleAutoRefresh}
          />
          <Action
            title="Refresh Now"
            icon={Icon.RotateClockwise}
            onAction={loadBots}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
          />
        </ActionPanel>
      }
    >
      {error && <List.EmptyView icon={Icon.Warning} title="Error" description={error} />}

      {!isLoading && botList.length === 0 && !error && (
        <List.EmptyView
          icon={Icon.Box}
          title="No Bots Found"
          description="Connect to ASF to see farming status"
        />
      )}

      {/* Farming Summary */}
      {botList.length > 0 && (
        <List.Section title="Farming Summary">
          <List.Item
            title="Active Bots"
            icon={Icon.CircleProgress}
            accessories={[{ text: `${activeBots.length} / ${botList.length}` }]}
          />
          <List.Item
            title="Currently Farming"
            icon={Icon.GameController}
            accessories={[{ text: `${farmingBots.length} bots` }]}
          />
          <List.Item
            title="Paused Bots"
            icon={Icon.Pause}
            accessories={[{ text: `${pausedBots.length} bots` }]}
          />
          <List.Item
            title="Total Cards Remaining"
            icon={Icon.Star}
            accessories={[{ text: `${totalCardsRemaining} cards` }]}
          />
        </List.Section>
      )}

      {/* Farming Bots */}
      {farmingBots.length > 0 && (
        <List.Section title="🎮 Currently Farming" subtitle={`${farmingBots.length} bots`}>
          {farmingBots.map(([botName, bot]) => {
            const games = bot.CardsFarmer?.CurrentGamesFarming || [];
            const timeRemaining = bot.CardsFarmer?.TimeRemaining || "Unknown";

            return (
              <List.Item
                key={botName}
                title={botName}
                subtitle={bot.Nickname || botName}
                accessories={[
                  { text: timeRemaining, icon: Icon.Clock },
                  { tag: { value: `${games.length} games`, color: "#1B2838" } },
                ]}
                actions={
                  <ActionPanel>
                    <Action
                      title="Pause Farming"
                      icon={Icon.Pause}
                      onAction={async () => {
                        // Pause logic would go here
                        showToast({ style: ToastStyle.Success, title: "Farming Paused" });
                      }}
                    />
                  </ActionPanel>
                }
              />
            );
          })}
        </List.Section>
      )}

      {/* All Bots */}
      {botList.length > 0 && (
        <List.Section title="All Bots" subtitle={`${botList.length} total`}>
          {botList.map(([botName, bot]) => {
            const isFarming =
              bot.CardsFarmer?.CurrentGamesFarming &&
              bot.CardsFarmer.CurrentGamesFarming.length > 0;
            const isPaused = bot.CardsFarmer?.Paused;
            const isConnected = bot.IsConnectedAndLoggedOn;

            return (
              <List.Item
                key={botName}
                title={botName}
                subtitle={bot.Nickname || botName}
                icon={isConnected ? Icon.CircleProgress : Icon.Circle}
                accessories={[
                  isFarming && { tag: { value: "Farming", color: "#4CAF50" } },
                  isPaused && { tag: { value: "Paused", color: "#FF9800" } },
                  !isConnected && { tag: { value: "Offline", color: "#F44336" } },
                ].filter(Boolean)}
              />
            );
          })}
        </List.Section>
      )}
    </List>
  );
}
