import type { DotPath } from "@gentleduck/iam";

export type AppAction =
	| "create"
	| "read"
	| "update"
	| "delete"
	| "publish"
	| "comment";
export type AppResource = "post" | "comment" | "user";
export type AppRole = "guest" | "reader" | "author" | "editor" | "admin";
export type AppScope = "workspace-alpha" | "workspace-beta";

export const APP_ACTIONS = [
	"create",
	"read",
	"update",
	"delete",
	"publish",
	"comment",
] as const;
export const APP_RESOURCES = ["post", "comment", "user"] as const;
export const APP_ROLES = [
	"guest",
	"reader",
	"author",
	"editor",
	"admin",
] as const;
export const APP_SCOPES = ["workspace-alpha", "workspace-beta"] as const;

export interface Post {
	id: string;
	title: string;
	body: string;
	ownerId: string;
	published: boolean;
	workspaceId: AppScope;
	tags: string[];
	createdAt: number;
}

export interface Comment {
	id: string;
	postId: string;
	body: string;
	ownerId: string;
	createdAt: number;
}

export interface User {
	id: string;
	name: string;
	email: string;
	tier: "free" | "pro";
	workspaceId: AppScope;
}

export interface AppCtx extends DotPath.IDefaultContext {
	subject: {
		id: string;
		roles: string[];
		attributes: {
			tier: "free" | "pro";
			workspaceId: AppScope;
			email: string;
		};
	};
	resource: {
		type: string;
		id?: string;
		attributes: {};
	};
	resourceAttributes: {
		post: {
			ownerId: string;
			published: boolean;
			workspaceId: AppScope;
			tagCount: number;
		};
		comment: { ownerId: string; postId: string };
		user: { id: string; tier: "free" | "pro"; workspaceId: AppScope };
	};
	environment: { now: number; hour: number; ip: string };
	scope: AppScope;
}
