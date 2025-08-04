import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Investor, BreadcrumbItem, Account } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, User } from 'lucide-react';

interface EditAccountProps {
    account: Account;
    investors: Investor[];
    errors?: {
        name?: string;
        amount?: string;
        investor_id?: number;
    };
}

export default function EditAccount({ account, investors, errors = {} }: EditAccountProps) {
    const [data, setData] = useState({
        name: account.name || '',
        amount: account.amount || '',
        investor_id: String(account.investor_id || ''),
    });
    const [processing, setProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Accounts',
            href: '/accounts',
        },
        {
            title: account.name,
            href: `/accounts/${account.id}`,
        },
        {
            title: 'Edit',
            href: `/accounts/${account.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const submitData = {
            ...data,
            investor_id: parseInt(data.investor_id, 10),
        };

        router.put(`/accounts/${account.id}`, submitData, {
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
            <Head title={`Edit ${account.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/investors/${account.id}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Account
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Account</h1>
                        <p className="text-sm text-gray-600">
                            Update {account.name}'s information
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Account Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={handleChange('name')}
                                    placeholder="Enter account name"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

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

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Link href={`/accounts/${account.id}`}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Updating...' : 'Update Account'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
