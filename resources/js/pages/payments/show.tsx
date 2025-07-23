import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Investor, BreadcrumbItem, SharedData, Payment } from '@/types';
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

interface ShowPaymentProps {
    payment: Payment;
}

export default function ShowPayment({ payment }: ShowPaymentProps) {
    const { flash } = usePage<SharedData>().props;
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Payments',
            href: '/payment',
        },
        {
            title: payment.investor?.name,
            href: `/payments/${payment.id}`,
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
        if (confirm(`Are you sure you want to delete payment "${payment.investor?.name}"? This action cannot be undone.`)) {
            router.delete(`/payments/${payment.id}`);
        }
    };

    const handleActivate = () => {
        router.patch(`/payments/${payment.id}/adjust`);
    };

    const handleSetPending = () => {
        router.patch(`/payments/${payment.id}/adjust`);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getStatusBadge = (status: boolean) => {
        switch (status) {
            case true:
                return <Badge variant="default" className="bg-green-100 text-green-800"><UserCheck className="w-3 h-3 mr-1" />Adjusted</Badge>;
            case false:
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
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

    const [rows, setRows] = useState([
        { account_id: '', for_month: '', amount: '', type: 'regular' },
    ]);

    const addRow = () => {
        setRows([...rows, { account_id: '', for_month: '', amount: '', type: 'regular' }]);
    };

   const handleChange = (index, field, value) => {
        setRows(prevRows => {
            const updated = [...prevRows];

            if (field === 'account_id') {
                const account = payment.investor?.active_accounts?.find(acc => acc.id === parseInt(value));
                if (account) {
                    updated[index]['amount'] = account.amount || 0;
                }
            }

            updated[index][field] = value;
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/investments/bulk', { investments: rows });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={payment.investor.name} />

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
                    <Link href="/payments">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payments
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-gray-900">Payment Details</h1>
                        <p className="text-sm text-gray-600">
                            View and manage payment information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!payment.is_adjusted && (
                            <Button onClick={handleActivate} size="sm" className="bg-green-600 hover:bg-green-700">
                                <UserCheck className="mr-2 h-4 w-4" />
                                Adjust
                            </Button>
                        )}
                        {payment.is_adjusted && (
                            <Button onClick={handleSetPending} variant="outline" size="sm">
                                <Clock className="mr-2 h-4 w-4" />
                                Pending
                            </Button>
                        )}
                        <Link href={`/payments/${payment.id}/edit`}>
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
                                            {getInitials(payment.investor.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{payment.amount}</h2>
                                            {payment.investor?.name && (
                                                <p className="text-gray-600">"{payment.investor?.name}"</p>
                                            )}
                                            <div className="mt-2">
                                                {getStatusBadge(payment.is_adjusted)}
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                                                <dd className="mt-1 text-sm font-mono text-gray-900">{payment.amount}</dd>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Remarks</dt>
                                                <dd className="mt-1 text-sm font-mono text-gray-900">{payment.remarks}</dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {!payment.is_adjusted && (
                        <div className="lg:col-span-2 space-y-6">
                            {/* Adjust amount */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Adjust amount
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {payment.investor?.active_accounts?.length > 0 ? (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {rows.map((row, index) => (
                                                <div key={index} className="grid grid-cols-4 gap-4 items-end">
                                                    {/* Account Dropdown */}
                                                    <div>
                                                        <label className="block text-sm font-medium">Account</label>
                                                        <select
                                                            className="w-full border rounded p-2"
                                                            value={row.account_id}
                                                            onChange={(e) => handleChange(index, 'account_id', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select</option>
                                                            {payment.investor?.active_accounts.map((account) => (
                                                                <option key={account.id} value={account.id}>
                                                                    {account.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Month Picker */}
                                                    <div>
                                                        <label className="block text-sm font-medium">For Month</label>
                                                        <input
                                                            type="month"
                                                            className="w-full border rounded p-2"
                                                            value={row.for_month}
                                                            onChange={(e) => handleChange(index, 'for_month', e.target.value)}
                                                            required
                                                        />
                                                    </div>

                                                    {/* Amount */}
                                                    <div>
                                                        <label className="block text-sm font-medium">Amount</label>
                                                        <input
                                                            type="number"
                                                            className="w-full border rounded p-2"
                                                            value={row.amount}
                                                            onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                                            required
                                                        />
                                                    </div>

                                                    {/* Type Dropdown */}
                                                    <div>
                                                        <label className="block text-sm font-medium">Type</label>
                                                        <select
                                                            className="w-full border rounded p-2"
                                                            value={row.type}
                                                            onChange={(e) => handleChange(index, 'type', e.target.value)}
                                                            required
                                                        >
                                                            <option value="regular">Regular</option>
                                                            <option value="eid">Eid</option>
                                                            <option value="others">Others</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Button */}
                                            <button
                                                type="button"
                                                onClick={addRow}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                + Add Row
                                            </button>

                                            {/* Submit Button */}
                                            <div>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                                >
                                                    Submit Investments
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <p className="text-sm text-gray-500">No active accounts available.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Payment Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Payment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(payment.created_at)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(payment.updated_at)}
                                    </dd>
                                </div>
                                {payment.investor && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Created By</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {payment.investor.name}
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
                                <Link href={`/payments/${payment.id}/edit`} className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Payment
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.open(`mailto:${payment.investor?.email}`, '_blank')}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.open(`tel:${payment.investor?.mobile}`, '_blank')}
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
