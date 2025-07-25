import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { User, BreadcrumbItem, SharedData, Investor, Account } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    CheckCircle
} from 'lucide-react';

interface AccountsPageProps {
    accounts: {
        data: Account[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters?: {
        search?: string;
        verified?: string;
        sort?: string;
        direction?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
];

export default function AccountsIndex({ accounts, filters = {} }: AccountsPageProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [verified, setVerified] = useState(filters?.verified || '');
    const [sortField, setSortField] = useState(filters?.sort || 'created_at');
    const [sortDirection, setSortDirection] = useState(filters?.direction || 'desc');

    // Get flash messages and current user from Laravel session
    const { props } = usePage<SharedData & { success?: string }>();
    const successMessage = props.success;
    const currentUser = props.auth.user;

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                handleFilterChange();
            }
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [search]);

    const handleFilterChange = () => {
        const params = {
            search: search || undefined,
            verified: verified || undefined,
            sort: sortField,
            direction: sortDirection,
        };

        router.get('/accounts', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (field: string) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);

        router.get('/accounts', {
            search: search || undefined,
            verified: verified || undefined,
            sort: field,
            direction: newDirection,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleVerifiedChange = (value: string) => {
        const filterValue = value === 'all' ? '' : value;
        setVerified(filterValue);
        router.get('/accounts', {
            search: search || undefined,
            verified: filterValue || undefined,
            sort: sortField,
            direction: sortDirection,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleDelete = (accountId: number, accountName: string) => {
        if (confirm(`Are you sure you want to delete ${accountName}? This action cannot be undone.`)) {
            router.delete(`/accounts/${accountId}`, {
                onSuccess: () => {
                    // Success message will be handled by Laravel session flash
                },
                onError: () => {
                    alert('Failed to delete account. Please try again.');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                        <p className="text-muted-foreground">
                            Manage and view all accounts in the system
                        </p>
                    </div>
                    {currentUser.type === 'admin' && (
                        <Link href="/accounts/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Account
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Success Message */}
                {successMessage && (
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            {successMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search users by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={verified || "all"} onValueChange={handleVerifiedChange}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Email Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Accounts</SelectItem>
                                    <SelectItem value="verified">Active</SelectItem>
                                    <SelectItem value="unverified">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Accounts Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('name')}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Account
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('investor')}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Investor
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </th>
                                        <th className="px-6 py-4 text-left">Amount</th>
                                        <th className="px-6 py-4 text-left">Total</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                        <th className="px-6 py-4 text-left">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('created_at')}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Joined
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {accounts.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                                No accounts found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        accounts.data.map((account) => (
                                            <tr key={account.id} className="hover:bg-muted/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarFallback>
                                                                {getInitials(account.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{account.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {account.investor?.name}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {account.amount}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                        <div className="text-sm">{ parseFloat(account.total_amount).toFixed(2) }</div>
                                                    </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant={account.is_active ? "default" : "destructive"}
                                                    >
                                                        {account.is_active ? 'Yes' : 'No'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {account.created_at}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {(currentUser.type === 'admin' || currentUser.id === account.id) && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/accounts/${account.id}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/accounts/${account.id}/edit`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                {currentUser.type === 'admin' && currentUser.id !== account.id && (
                                                                    <DropdownMenuItem
                                                                        className="text-destructive"
                                                                        onClick={() => handleDelete(account.id, account.name)}
                                                                    >
                                                                        <Trash className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {accounts.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-6 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {accounts.data.length} of {accounts.total} users
                                </div>
                                <div className="flex items-center gap-2">
                                    {accounts.links.map((link, index) => {
                                        if (link.label === '&laquo; Previous') {
                                            return (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        if (link.label === 'Next &raquo;') {
                                            return (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        if (link.label === '...') {
                                            return (
                                                <span key={index} className="px-2 text-muted-foreground">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                            >
                                                {link.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
