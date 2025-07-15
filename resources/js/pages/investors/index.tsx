import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Investor, BreadcrumbItem, SharedData } from '@/types';
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
    CheckCircle,
    UserCheck,
    Clock
} from 'lucide-react';

interface InvestorsPageProps {
    investors: {
        data: Investor[];
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
        status?: string;
    };
    statuses: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Investors',
        href: '/investors',
    },
];

export default function InvestorsIndex({ investors, filters = {}, statuses }: InvestorsPageProps) {
    const { flash } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    const handleFilterChange = () => {
        router.get('/investors', 
            { 
                search: searchTerm || undefined,
                status: statusFilter === 'all' ? undefined : statusFilter,
            },
            { 
                preserveState: true,
                replace: true 
            }
        );
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        router.get('/investors', 
            { 
                search: searchTerm || undefined,
                status: value === 'all' ? undefined : value,
            },
            { 
                preserveState: true,
                replace: true 
            }
        );
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleDelete = (investorId: number, investorName: string) => {
        if (confirm(`Are you sure you want to delete investor "${investorName}"? This action cannot be undone.`)) {
            router.delete(`/investors/${investorId}`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800"><UserCheck className="w-3 h-3 mr-1" />Active</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Investors" />
            
            <div className="space-y-6">
                {showSuccessAlert && flash?.success && (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Investors</h1>
                        <p className="text-sm text-gray-600">
                            Manage your investor database and profiles
                        </p>
                    </div>
                    <Link href="/investors/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Investor
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Search & Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, email, or UID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilterChange()}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="md:w-48">
                                <Select value={statusFilter} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {statuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleFilterChange} variant="outline">
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Investors ({investors.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {investors.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-gray-500">No investors found.</p>
                                <Link href="/investors/create" className="mt-4 inline-block">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Investor
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Investor
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    UID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Contact
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Created
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {investors.data.map((investor) => (
                                                <tr key={investor.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                                                    {getInitials(investor.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {investor.name}
                                                                </div>
                                                                {investor.nickname && (
                                                                    <div className="text-sm text-gray-500">
                                                                        "{investor.nickname}"
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-mono text-gray-900">
                                                            {investor.uid}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{investor.email}</div>
                                                        <div className="text-sm text-gray-500">{investor.mobile}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(investor.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(investor.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/investors/${investor.id}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/investors/${investor.id}/edit`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(investor.id, investor.name)}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {investors.last_page > 1 && (
                                    <div className="flex items-center justify-between border-t bg-white px-4 py-3 sm:px-6">
                                        <div className="flex flex-1 justify-between sm:hidden">
                                            <Button
                                                variant="outline"
                                                onClick={() => router.get(investors.links.find(link => link.label === '&laquo; Previous')?.url || '')}
                                                disabled={investors.current_page === 1}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => router.get(investors.links.find(link => link.label === 'Next &raquo;')?.url || '')}
                                                disabled={investors.current_page === investors.last_page}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing{' '}
                                                    <span className="font-medium">
                                                        {(investors.current_page - 1) * investors.per_page + 1}
                                                    </span>{' '}
                                                    to{' '}
                                                    <span className="font-medium">
                                                        {Math.min(investors.current_page * investors.per_page, investors.total)}
                                                    </span>{' '}
                                                    of{' '}
                                                    <span className="font-medium">{investors.total}</span> results
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                                    {investors.links.map((link, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => link.url && router.get(link.url)}
                                                            disabled={!link.url}
                                                            className={`
                                                                relative inline-flex items-center px-4 py-2 text-sm font-medium
                                                                ${link.active 
                                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }
                                                                ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                                                ${index === 0 ? 'rounded-l-md' : ''}
                                                                ${index === investors.links.length - 1 ? 'rounded-r-md' : ''}
                                                                border
                                                            `}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ))}
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}