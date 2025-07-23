import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';

interface Investor {
    id: number;
    name: string;
}

interface CreatePaymentProps {
    investors: Investor[];
    errors?: {
        amount?: string;
        investor_id?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: '/payments',
    },
    {
        title: 'Create Payment',
        href: '/payments/create',
    },
];

export default function CreatePayment({ investors, errors = {} }: CreatePaymentProps) {
    const [data, setData] = useState({
        remarks: '',
        amount: '',
        investor_id: '',
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/payments', data, {
            onFinish: () => setProcessing(false),
            onError: () => setProcessing(false),
        });
    };

    const handleChange = (field: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSelectChange = (field: keyof typeof data) => (value: string) => {
        setData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Payment" />

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
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create Payment</h1>
                            <p className="text-muted-foreground">
                                Add a new payment to the system
                            </p>
                        </div>
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
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Create Payment
                                        </>
                                    )}
                                </Button>
                                <Link href="/payments">
                                    <Button type="button" variant="outline" disabled={processing}>
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
