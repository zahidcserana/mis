import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Investor, BreadcrumbItem, Payment } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, User } from 'lucide-react';

interface EditPaymentProps {
    payment: Payment;
    investors: Investor[];
    errors?: {
        amount?: string;
        investor_id?: number;
    };
}

export default function EditPayment({ payment, investors, errors = {} }: EditPaymentProps) {
    const [data, setData] = useState({
        remarks: payment.remarks || '',
        amount: payment.amount || '',
        investor_id: String(payment.investor_id || ''),
    });
    const [processing, setProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Payments',
            href: '/payments',
        },
        {
            title: payment.investor?.name,
            href: `/payments/${payment.id}`,
        },
        {
            title: 'Edit',
            href: `/payments/${payment.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const submitData = {
            ...data,
            investor_id: parseInt(data.investor_id, 10),
        };

        router.put(`/payments/${payment.id}`, submitData, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleChange = (field: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSelectChange = (field: keyof typeof data) => (value: string) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const copyPermanentToCurrent = () => {
        setData(prev => ({
            ...prev,
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${payment.investor?.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/investors/${payment.id}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payment
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Payment</h1>
                        <p className="text-sm text-gray-600">
                            Update {payment.investor?.name}'s information
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Amount Field */}
                            <div className="space-y-2">
                                <Label htmlFor="amount">amount</Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    value={data.amount}
                                    onChange={handleChange('amount')}
                                    placeholder="Enter amount"
                                    className={errors.amount ? 'border-destructive' : ''}
                                />
                                {errors.amount && (
                                    <p className="text-sm text-destructive">{errors.amount}</p>
                                )}
                            </div>

                            {/* User Type Field */}
                            <div className="space-y-2">
                                <Label htmlFor="investor_id">Investor</Label>
                                <Select value={data.investor_id} onValueChange={handleSelectChange('investor_id')}>
                                    <SelectTrigger className={errors.investor_id ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Select investor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {investors.map(investor => (
                                            <SelectItem key={investor.id} value={String(investor.id)}>
                                                {investor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.investor_id && (
                                    <p className="text-sm text-destructive">{errors.investor_id}</p>
                                )}
                            </div>

                            {/* remarks Field */}
                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks</Label>
                                <Input
                                    id="remarks"
                                    type="text"
                                    value={data.remarks}
                                    onChange={handleChange('remarks')}
                                    placeholder="Enter remarks"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Link href={`/payments/${payment.id}`}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Updating...' : 'Update Payment'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
