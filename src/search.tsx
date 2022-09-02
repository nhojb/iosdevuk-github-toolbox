import { Action, ActionPanel, Detail, Icon, Image, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";

import { personalAccessToken, username } from "./preferences";
import { Issue, Response } from "./types";

export default function Command() {
  const [query, setQuery] = useState("");

  const { data, isLoading } = useFetch<Response>(
    "https://api.github.com/search/issues?" + new URLSearchParams({ q: query }),
    {
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${personalAccessToken}` },
    }
  );

  return (
    <List isLoading={isLoading} searchBarAccessory={<QueryDropdown onChange={setQuery} />}>
      {data?.items
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .map((issue) => (
          <List.Item
            key={issue.id}
            icon={issue.state === "open" ? Icon.Circle : Icon.CheckCircle}
            title={issue.title}
            subtitle={`#${issue.number}`}
            accessories={[
              {
                date: new Date(issue.updated_at),
                tooltip: `Updated at: ${new Date(issue.updated_at).toLocaleString()}`,
              },
              {
                icon: { source: issue.user?.avatar_url ?? Icon.PersonCircle, mask: Image.Mask.Circle },
                tooltip: `Assignee: ${issue.user?.login}`,
              },
            ]}
            actions={<Actions issue={issue} />}
          />
        ))}
    </List>
  );
}

function IssueDetail(props: { issue: Issue }) {
  return <Detail markdown={props.issue.body} actions={<Actions issue={props.issue} isDetail />} />;
}

function Actions(props: { issue: Issue; isDetail?: boolean }) {
  return (
    <ActionPanel>
      {!props.isDetail && (
        <Action.Push icon={Icon.Sidebar} title="Show Details" target={<IssueDetail issue={props.issue} />} />
      )}
      <Action.OpenInBrowser url={props.issue.html_url} />
      <ActionPanel.Section>
        <Action.CopyToClipboard
          title="Copy URL"
          content={props.issue.html_url}
          shortcut={{ modifiers: ["cmd"], key: "." }}
        />
        <Action.CopyToClipboard
          title="Copy Title"
          content={props.issue.title}
          shortcut={{ modifiers: ["cmd", "shift"], key: "." }}
        />
        <Action.CopyToClipboard
          title="Copy Markdown"
          content={`[${props.issue.title}](${props.issue.html_url})`}
          shortcut={{ modifiers: ["cmd", "shift"], key: "," }}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}

function QueryDropdown(props: { onChange: (query: string) => void }) {
  return (
    <List.Dropdown tooltip="Select query" onChange={props.onChange} storeValue>
      <List.Dropdown.Item value={`is:issue mentions:${username} archived:false`} title="Mentions" />
      <List.Dropdown.Item value={`is:issue assignee:${username} archived:false`} title="Assigned Issues" />
    </List.Dropdown>
  );
}
