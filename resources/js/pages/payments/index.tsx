import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { User, BreadcrumbItem, SharedData, Investor, Payment } from '@/types';
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

interface PaymentsPageProps {
    payments: {
        data: Payment[];
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
        is_adjusted?: string;
        sort?: string;
        direction?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: '/payments',
    },
];

export default function PaymentsIndex({ payments, filters = {} }: PaymentsPageProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [is_adjusted, setIsAdjusted] = useState(filters?.is_adjusted || '');
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
            is_adjusted: is_adjusted || undefined,
            sort: sortField,
            direction: sortDirection,
        };

        router.get('/payments', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (field: string) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);

        router.get('/payments', {
            search: search || undefined,
            is_adjusted: is_adjusted || undefined,
            sort: field,
            direction: newDirection,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleVerifiedChange = (value: string) => {
        const filterValue = value === 'all' ? '' : value;
        setIsAdjusted(filterValue);
        router.get('/payments', {
            search: search || undefined,
            is_adjusted: filterValue || undefined,
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

    const handleDelete = (paymentId: number, paymentName: string) => {
        if (confirm(`Are you sure you want to delete the payment of ${paymentName}? This action cannot be undone.`)) {
            router.delete(`/payments/${paymentId}`, {
                onSuccess: () => {
                    // Success message will be handled by Laravel session flash
                },
                onError: () => {
                    alert('Failed to delete payment. Please try again.');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                        <p className="text-muted-foreground">
                            Manage and view all payments in the system
                        </p>
                    </div>
                    {currentUser.type === 'admin' && (
                        <Link href="/payments/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Payment
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
                            <Select value={is_adjusted || "all"} onValueChange={handleVerifiedChange}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Email Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Adjust status</SelectItem>
                                    <SelectItem value="1">Yes</SelectItem>
                                    <SelectItem value="0">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
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
                                        <th className="px-6 py-4 text-left">Adjust Status</th>
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
                                    {payments.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                                No payments found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.data.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-muted/50">
                                                <td className="px-6 py-4">
                                                    {payment.investor?.name}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {payment.amount}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant={payment.is_adjusted ? "default" : "destructive"}
                                                    >
                                                        {payment.is_adjusted ? 'Yes' : 'No'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {payment.created_at}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {(currentUser.type === 'admin' || currentUser.id === payment.id) && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/payments/${payment.id}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/payments/${payment.id}/edit`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                {currentUser.type === 'admin' && currentUser.id !== payment.id && (
                                                                    <DropdownMenuItem
                                                                        className="text-destructive"
                                                                        onClick={() => handleDelete(payment.id, payment.investor?.name)}
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
                        {payments.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-6 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {payments.data.length} of {payments.total} users
                                </div>
                                <div className="flex items-center gap-2">
                                    {payments.links.map((link, index) => {
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
