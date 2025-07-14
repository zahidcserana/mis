import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Investor, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, User } from 'lucide-react';

interface EditInvestorProps {
    investor: Investor;
    statuses: string[];
    errors?: {
        uid?: string;
        name?: string;
        nickname?: string;
        email?: string;
        permanent_address?: string;
        current_address?: string;
        mobile?: string;
        emergency_mobile?: string;
        status?: string;
        personal_info?: string;
    };
}

export default function EditInvestor({ investor, statuses, errors = {} }: EditInvestorProps) {
    const [data, setData] = useState({
        uid: investor.uid || '',
        name: investor.name || '',
        nickname: investor.nickname || '',
        email: investor.email || '',
        permanent_address: investor.permanent_address || '',
        current_address: investor.current_address || '',
        mobile: investor.mobile || '',
        emergency_mobile: investor.emergency_mobile || '',
        status: investor.status || 'pending',
        personal_info: investor.personal_info ? JSON.stringify(investor.personal_info, null, 2) : '',
    });
    const [processing, setProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Investors',
            href: '/investors',
        },
        {
            title: investor.name,
            href: `/investors/${investor.id}`,
        },
        {
            title: 'Edit',
            href: `/investors/${investor.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Parse personal_info as JSON if provided
        let parsedPersonalInfo = null;
        if (data.personal_info.trim()) {
            try {
                parsedPersonalInfo = JSON.parse(data.personal_info);
            } catch (error) {
                alert('Personal information must be valid JSON format');
                setProcessing(false);
                return;
            }
        }

        const submitData = {
            ...data,
            personal_info: parsedPersonalInfo,
        };

        router.put(`/investors/${investor.id}`, submitData, {
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
            current_address: prev.permanent_address
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${investor.name}`} />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/investors/${investor.id}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Investor
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Investor</h1>
                        <p className="text-sm text-gray-600">
                            Update {investor.name}'s information
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="uid">UID *</Label>
                                        <Input
                                            id="uid"
                                            type="text"
                                            value={data.uid}
                                            onChange={handleChange('uid')}
                                            placeholder="e.g., INV001"
                                            className={errors.uid ? 'border-red-500' : ''}
                                        />
                                        {errors.uid && (
                                            <p className="mt-1 text-sm text-red-600">{errors.uid}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select value={data.status} onValueChange={handleSelectChange('status')}>
                                            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={handleChange('name')}
                                        placeholder="John Doe"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="nickname">Nickname</Label>
                                    <Input
                                        id="nickname"
                                        type="text"
                                        value={data.nickname}
                                        onChange={handleChange('nickname')}
                                        placeholder="Johnny"
                                        className={errors.nickname ? 'border-red-500' : ''}
                                    />
                                    {errors.nickname && (
                                        <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={handleChange('email')}
                                        placeholder="john@example.com"
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="mobile">Mobile Number *</Label>
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        value={data.mobile}
                                        onChange={handleChange('mobile')}
                                        placeholder="+1 (555) 123-4567"
                                        className={errors.mobile ? 'border-red-500' : ''}
                                    />
                                    {errors.mobile && (
                                        <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="emergency_mobile">Emergency Contact Number</Label>
                                    <Input
                                        id="emergency_mobile"
                                        type="tel"
                                        value={data.emergency_mobile}
                                        onChange={handleChange('emergency_mobile')}
                                        placeholder="+1 (555) 987-6543"
                                        className={errors.emergency_mobile ? 'border-red-500' : ''}
                                    />
                                    {errors.emergency_mobile && (
                                        <p className="mt-1 text-sm text-red-600">{errors.emergency_mobile}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="permanent_address">Permanent Address *</Label>
                                <Textarea
                                    id="permanent_address"
                                    value={data.permanent_address}
                                    onChange={handleChange('permanent_address')}
                                    placeholder="123 Main Street, City, State, ZIP Code"
                                    rows={3}
                                    className={errors.permanent_address ? 'border-red-500' : ''}
                                />
                                {errors.permanent_address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.permanent_address}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="current_address">Current Address *</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={copyPermanentToCurrent}
                                        className="text-sm"
                                    >
                                        Copy from permanent
                                    </Button>
                                </div>
                                <Textarea
                                    id="current_address"
                                    value={data.current_address}
                                    onChange={handleChange('current_address')}
                                    placeholder="456 Current Street, City, State, ZIP Code"
                                    rows={3}
                                    className={errors.current_address ? 'border-red-500' : ''}
                                />
                                {errors.current_address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.current_address}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="personal_info">Personal Information (JSON)</Label>
                                <Textarea
                                    id="personal_info"
                                    value={data.personal_info}
                                    onChange={handleChange('personal_info')}
                                    placeholder='{"date_of_birth": "1990-01-01", "occupation": "Engineer", "notes": "VIP client"}'
                                    rows={4}
                                    className={errors.personal_info ? 'border-red-500' : ''}
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Optional: Enter additional information as JSON format
                                </p>
                                {errors.personal_info && (
                                    <p className="mt-1 text-sm text-red-600">{errors.personal_info}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Link href={`/investors/${investor.id}`}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Updating...' : 'Update Investor'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}