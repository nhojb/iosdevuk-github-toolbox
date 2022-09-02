import { Icon, Image, MenuBarExtra, open } from "@raycast/api";
import { useFetch } from "@raycast/utils";

import { personalAccessToken, username } from "./preferences";
import { Response } from "./types";

export default function MenuCommand() {
  const { data, isLoading } = useFetch<Response>(
    "https://api.github.com/search/issues?" + new URLSearchParams({ q: `assignee:${username} is:open is:issue` }),
    {
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${personalAccessToken}` },
    }
  );

  return (
    <MenuBarExtra
      icon="lee.png"
      title={data && data.items ? String(data.items.length) : undefined}
      isLoading={isLoading}
    >
      {data?.items.map((issue) => (
        <MenuBarExtra.Item
          key={issue.id}
          icon={{ source: issue.user?.avatar_url ?? Icon.PersonCircle, mask: Image.Mask.Circle }}
          title={issue.title}
          onAction={() => open(issue.html_url)}
        />
      ))}
    </MenuBarExtra>
  );
}
