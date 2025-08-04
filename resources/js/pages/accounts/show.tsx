import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Investor, BreadcrumbItem, SharedData, Account } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    ArrowLeft,
    Edit,
    Trash,
    Mail,
    Phone,
    MapPin,
    User,
    Calendar,
    CheckCircle,
    UserCheck,
    Clock
} from 'lucide-react';

interface ShowAccountProps {
    account: Account;
}

export default function ShowAccount({ account }: ShowAccountProps) {
    const { flash } = usePage<SharedData>().props;
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Accounts',
            href: '/account',
        },
        {
            title: account.name,
            href: `/accounts/${account.id}`,
        },
    ];

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete account "${account.name}"? This action cannot be undone.`)) {
            router.delete(`/accounts/${account.id}`);
        }
    };

    const handleActivate = () => {
        router.patch(`/accounts/${account.id}/activate`);
    };

    const handleSetPending = () => {
        router.patch(`/accounts/${account.id}/activate`);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getStatusBadge = (status: boolean) => {
        switch (status) {
            case true:
                return <Badge variant="default" className="bg-green-100 text-green-800"><UserCheck className="w-3 h-3 mr-1" />Active</Badge>;
            case false:
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Inactive</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={account.name} />

            <div className="space-y-6">
                {showSuccessAlert && flash?.success && (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center gap-4">
                    <Link href="/accounts">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Accounts
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-gray-900">Account Details</h1>
                        <p className="text-sm text-gray-600">
                            View and manage account information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!account.is_active && (
                            <Button onClick={handleActivate} size="sm" className="bg-green-600 hover:bg-green-700">
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                            </Button>
                        )}
                        {account.is_active && (
                            <Button onClick={handleSetPending} variant="outline" size="sm">
                                <Clock className="mr-2 h-4 w-4" />
                                Inactivate
                            </Button>
                        )}
                        <Link href={`/accounts/${account.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Investor Profile */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                                            {getInitials(account.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{account.name}</h2>
                                            {account.investor?.name && (
                                                <p className="text-gray-600">"{account.investor?.name}"</p>
                                            )}
                                            <div className="mt-2">
                                                {getStatusBadge(account.is_active)}
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                                                <dd className="mt-1 text-sm font-mono text-gray-900">{account.amount}</dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Account Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(account.created_at)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(account.updated_at)}
                                    </dd>
                                </div>
                                {account.investor && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Created By</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {account.investor.name}
                                        </dd>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href={`/accounts/${account.id}/edit`} className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Account
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.open(`mailto:${account.investor?.email}`, '_blank')}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.open(`tel:${account.investor?.mobile}`, '_blank')}
                                >
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call Mobile
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
