import { useEffect, useState } from "react";

const DEFAULT_SETTINGS = {
  darkMode: true,
  compactMode: false,
  notificationPayment: true,
  notificationSchedule: true,
  notificationAnnouncement: true,
};

export default function useSantriSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem("santri_settings");

      if (saved) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(saved),
        });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error("LOAD SETTINGS ERROR:", error.message);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadSettings();

    const handleUpdate = () => {
      loadSettings();
    };

    window.addEventListener("santri_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("santri_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    settings,
    mounted,
  };
}