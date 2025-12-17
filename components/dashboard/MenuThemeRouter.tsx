import ElegantTheme from "../menu-themes/ElegantTheme";
import MinimalTheme from "../menu-themes/MinimalTheme";
import DarkTheme from "../menu-themes/DarkTheme";
import LightTheme from "../menu-themes/LightTheme";
import { PublicMenu } from "@/types/menu";

export default function MenuThemeRouter({ menu }: { menu: PublicMenu }) {
  switch (menu.theme) {
    case "elegant":
      return <ElegantTheme menu={menu} />;
    case "minimal":
      return <MinimalTheme menu={menu} />;
    case "dark":
      return <DarkTheme menu={menu} />;
    case "light":
      return <LightTheme menu={menu} />;
    default:
      return <LightTheme menu={menu} />;
  }
}
