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
    Clock,
    DollarSignIcon,
    UserIcon,
    NotebookIcon
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
        router.post('/investments/bulk/' + payment.id, { investments: rows });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title={payment.investor.name} />

                    <div className="flex h-full flex-1 flex-col gap-6 p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link href="/payments">
                                    <Button variant="outline" size="sm">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Payments
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="text-lg">
                                            {getInitials(payment.investor.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight">{payment.amount} <small className='fs-1'>{formatDate(payment.created_at)}</small> </h1>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={payment.is_adjusted ? "default" : "secondary"}
                                            >
                                                {payment.is_adjusted ? 'Adjusted' : 'Pending'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {!payment.is_adjusted && (
                                <Button onClick={handleActivate} size="sm" className="bg-green-600 hover:bg-green-700">
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Mark as Adjusted
                                    </Button>
                                )}
                                {payment.is_adjusted && (
                                    <Button onClick={handleSetPending} variant="outline" size="sm">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Mark as Pending
                                    </Button>
                                )}
                                <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                                <Link href={`/payments/${payment.id}/edit`}>
                                    <Button>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Payment
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSignIcon className="h-5 w-5" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                                            <p className="text-base font-medium">{payment.amount}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Investor</p>
                                            <p className="text-base font-medium">{payment.investor?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Adjusted</p>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={payment.is_adjusted ? 'destructive' : 'outline'}
                                                >
                                                    {payment.is_adjusted ? 'Yes' : 'No'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <NotebookIcon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                                            <p className="text-base font-medium">{payment.remarks}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Logs */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Badge className="h-5 w-5" />
                                        Payment Logs
                                        {payment.logs && payment.logs.length > 0 && (
                                            <span className="ml-auto text-sm text-muted-foreground">
                                                Adjust Amount: ৳
                                                {payment.logs.reduce((sum, log) => sum + parseFloat(log.amount), 0).toFixed(2)}
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {payment.logs && payment.logs.length > 0 ? (
                                        payment.logs.map((log, index) => (
                                            <div
                                                key={index}
                                                className="border p-4 rounded bg-gray-50 space-y-1 text-sm"
                                            >
                                                <div><strong>Account ID:</strong> {log.account_id}</div>
                                                <div><strong>For Month:</strong> {log.for_month}</div>
                                                <div><strong>Amount:</strong> ৳{parseFloat(log.amount).toFixed(2)}</div>
                                                <div><strong>Type:</strong> {log.type}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-muted-foreground">No logs available.</div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Adjust Payment */}
                            {!payment.is_adjusted && (
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            Adjust Payment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="w-full">
                                            {payment.investor?.active_accounts?.length > 0 ? (
                                                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                                                    {rows.map((row, index) => (
                                                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                                                            {/* Account Dropdown */}
                                                            <div className="w-full">
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
                                                            <div className="w-full">
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
                                                            <div className="w-full">
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
                                                            <div className="w-full">
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
                                                    <div className="pt-2">
                                                        <button
                                                            type="button"
                                                            onClick={addRow}
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            + Add Row
                                                        </button>
                                                    </div>

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
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </AppLayout>
    );
}
