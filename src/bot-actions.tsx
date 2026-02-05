import { List, ActionPanel, Action, Icon, ToastStyle, showToast, confirmAlert } from "@raycast/api";
import { useState, useEffect } from "react";
import { getBots, pauseBot, resumeBot, startBot, stopBot } from "./utils/api";

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

  const refreshBots = async () => {
    await loadBots();
    showToast({ style: ToastStyle.Success, title: "Refreshed" });
  };

  const handlePause = async (botName: string) => {
    if (
      await confirmAlert({
        title: `Pause ${botName}?`,
        message: "Are you sure you want to pause this bot?",
        primaryAction: { title: "Pause", style: Action.Style.Destructive },
      })
    ) {
      try {
        await pauseBot(botName, false);
        await showToast({ style: ToastStyle.Success, title: `${botName} Paused` });
        await refreshBots();
      } catch (err) {
        await showToast({
          style: ToastStyle.Failure,
          title: "Failed to Pause",
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }
  };

  const handleResume = async (botName: string) => {
    try {
      await resumeBot(botName);
      await showToast({ style: ToastStyle.Success, title: `${botName} Resumed` });
      await refreshBots();
    } catch (err) {
      await showToast({
        style: ToastStyle.Failure,
        title: "Failed to Resume",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleStart = async (botName: string) => {
    try {
      await startBot(botName);
      await showToast({ style: ToastStyle.Success, title: `${botName} Started` });
      await refreshBots();
    } catch (err) {
      await showToast({
        style: ToastStyle.Failure,
        title: "Failed to Start",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleStop = async (botName: string) => {
    if (
      await confirmAlert({
        title: `Stop ${botName}?`,
        message: "Are you sure you want to stop this bot?",
        primaryAction: { title: "Stop", style: Action.Style.Destructive },
      })
    ) {
      try {
        await stopBot(botName);
        await showToast({ style: ToastStyle.Success, title: `${botName} Stopped` });
        await refreshBots();
      } catch (err) {
        await showToast({
          style: ToastStyle.Failure,
          title: "Failed to Stop",
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }
  };

  const botList = Object.entries(bots);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search bots..."
      throttle
      actions={
        <ActionPanel>
          <Action
            title="Refresh Bots"
            icon={Icon.RotateClockwise}
            onAction={refreshBots}
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
          description="Connect to ASF to see your bots"
        />
      )}

      {botList.length > 0 && (
        <List.Section title="Bots" subtitle={`${botList.length} bots`}>
          {botList.map(([botName, bot]) => {
            const isConnected = bot.IsConnectedAndLoggedOn;
            const isPaused = bot.CardsFarmer?.Paused;
            const isFarming =
              bot.CardsFarmer?.CurrentGamesFarming &&
              bot.CardsFarmer.CurrentGamesFarming.length > 0;

            let statusTag;
            if (!isConnected) {
              statusTag = { tag: { value: "Offline", color: "#F44336" } };
            } else if (isPaused) {
              statusTag = { tag: { value: "Paused", color: "#FF9800" } };
            } else if (isFarming) {
              statusTag = { tag: { value: "Farming", color: "#4CAF50" } };
            } else {
              statusTag = { tag: { value: "Idle", color: "#2196F3" } };
            }

            return (
              <List.Item
                key={botName}
                title={botName}
                subtitle={bot.Nickname || botName}
                icon={isConnected ? Icon.CircleProgress : Icon.Circle}
                accessories={[
                  statusTag,
                  isFarming && {
                    text: `${bot.CardsFarmer.CurrentGamesFarming.length} games`,
                  },
                ].filter(Boolean)}
                actions={
                  <ActionPanel>
                    {isPaused ? (
                      <Action
                        title="Resume Bot"
                        icon={Icon.Play}
                        onAction={() => handleResume(botName)}
                        shortcut={{ modifiers: ["cmd"], key: "r" }}
                      />
                    ) : (
                      <Action
                        title="Pause Bot"
                        icon={Icon.Pause}
                        onAction={() => handlePause(botName)}
                        shortcut={{ modifiers: ["cmd"], key: "p" }}
                      />
                    )}

                    {!isConnected ? (
                      <Action
                        title="Start Bot"
                        icon={Icon.PlayCircle}
                        onAction={() => handleStart(botName)}
                        shortcut={{ modifiers: ["cmd"], key: "s" }}
                      />
                    ) : (
                      <Action
                        title="Stop Bot"
                        icon={Icon.StopCircle}
                        onAction={() => handleStop(botName)}
                        shortcut={{ modifiers: ["cmd"], key: "x" }}
                        style={Action.Style.Destructive}
                      />
                    )}

                    <Action
                      title="Refresh Status"
                      icon={Icon.RotateClockwise}
                      onAction={refreshBots}
                      shortcut={{ modifiers: ["shift", "cmd"], key: "r" }}
                    />
                  </ActionPanel>
                }
              />
            );
          })}
        </List.Section>
      )}
    </List>
  );
}
