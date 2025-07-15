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

interface CreateAccountProps {
    investors: Investor[];
    errors?: {
        name?: string;
        amount?: string;
        investor_id?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
    {
        title: 'Create Account',
        href: '/accounts/create',
    },
];

export default function CreateAccount({ investors, errors = {} }: CreateAccountProps) {
    const [data, setData] = useState({
        name: '',
        amount: '',
        investor_id: '',
    });
    // const [showPassword, setShowPassword] = useState(false);
    // const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/accounts', data, {
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
            <Head title="Create Account" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/accounts">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Accounts
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                            <p className="text-muted-foreground">
                                Add a new account to the system
                            </p>
                        </div>
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
                                        <SelectValue placeholder="Select user type" />
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
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Create Account
                                        </>
                                    )}
                                </Button>
                                <Link href="/accounts">
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
