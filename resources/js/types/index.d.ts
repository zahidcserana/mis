import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    type: 'admin' | 'member';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Investor {
    id: number;
    user_id: number;
    uid: string;
    name: string;
    nickname?: string;
    email: string;
    permanent_address: string;
    current_address: string;
    personal_info?: any;
    mobile: string;
    emergency_mobile?: string;
    status: 'pending' | 'active';
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface Account {
    id: number;
    investor_id: number;
    name: string;
    amount?: number;
    is_active: boolean;
    investor?: Investor;
    created_at: string;
    updated_at: string;
}

