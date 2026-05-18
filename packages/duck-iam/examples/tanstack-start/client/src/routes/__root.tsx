import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import Header from "../components/Header";
import { UserSwitcher } from "../components/UserSwitcher";

import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";

import { AuthProvider, useCurrentUser } from "../iam/auth-context";
import { IamDevtools } from "@gentleduck/iam/dt";
import { engine, flow, metrics } from "../iam/engine";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "duck-iam · TanStack Start example" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
});

function IamDevtoolsLauncher() {
	const me = useCurrentUser();
	return (
		<IamDevtools
			buttonPosition="bottom-left"
			defaultRequest={{
				subjectId: me?.id ?? "",
				action: "read",
				resourceType: "post",
				attributesJson:
					'{ "ownerId": "u-alice", "published": true, "workspaceId": "workspace-alpha", "tagCount": 1 }',
				environmentJson: '{ "hour": 10 }',
				scope: me?.workspaceId ?? "",
			}}
			engine={engine}
			flow={flow}
			metrics={metrics}
		/>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
				<TanStackQueryProvider>
					<AuthProvider>
						<Header />
						<UserSwitcher />
						{children}
						<IamDevtoolsLauncher />
					</AuthProvider>
				</TanStackQueryProvider>
				<Scripts />
			</body>
		</html>
	);
}
