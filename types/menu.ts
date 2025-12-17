import { Prisma } from "@prisma/client";

export type PublicMenu = Prisma.MenuGetPayload<{
  include: {
    categories: {
      include: {
        items: true;
      };
    };
  };
}>;
export interface UIMenuItem {
  id: string;
}

export interface UIMenuCategory {
  id: string;
  items: UIMenuItem[];
}

export interface UIMenu {
  id: string;
  title: string | null;
  description: string | null;
  theme: string;
  status: string;
  logoUrl: string | null;
  categories: UIMenuCategory[];
}
