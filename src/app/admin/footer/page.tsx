"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSiteContent, updateSiteContent } from '@/lib/storage';
import type { SiteContent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const siteContentSchema = z.object({
  contactEmail: z.string().email("Please enter a valid email."),
  contactPhone: z.string().min(1, "Phone number is required."),
  contactAddress: z.string().min(1, "Address is required."),
  privacyPolicy: z.string().min(1, "Privacy policy content cannot be empty."),
});

type SiteContentFormValues = z.infer<typeof siteContentSchema>;

export default function FooterManagementPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const form = useForm<SiteContentFormValues>({
    resolver: zodResolver(siteContentSchema),
    defaultValues: {
      contactEmail: '',
      contactPhone: '',
      contactAddress: '',
      privacyPolicy: '',
    }
  });

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const content = await getSiteContent();
      form.reset(content);
      setLoading(false);
    };
    loadContent();
  }, [form]);

  const onSubmit = async (data: SiteContentFormValues) => {
    setSaving(true);
    try {
      await updateSiteContent(data);
      toast({
        title: 'Content Updated',
        description: 'The site content has been saved successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Saving Content',
        description: 'Something went wrong. Please try again.',
      });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Footer Management</h1>
        <p className="text-muted-foreground">Update the content for the Contact Us and Privacy Policy pages linked in the footer.</p>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact Us Page</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy Page</TabsTrigger>
        </TabsList>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Edit the details that appear on the "Contact Us" page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input id="contactEmail" {...form.register('contactEmail')} />
                      {form.formState.errors.contactEmail && <p className="text-sm text-destructive mt-1">{form.formState.errors.contactEmail.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number</Label>
                      <Input id="contactPhone" {...form.register('contactPhone')} />
                      {form.formState.errors.contactPhone && <p className="text-sm text-destructive mt-1">{form.formState.errors.contactPhone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactAddress">Office Address</Label>
                      <Input id="contactAddress" {...form.register('contactAddress')} />
                      {form.formState.errors.contactAddress && <p className="text-sm text-destructive mt-1">{form.formState.errors.contactAddress.message}</p>}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="privacy" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy Content</CardTitle>
                <CardDescription>
                  Edit the content for the "Privacy Policy" page. You can use `##` for headings (e.g., `## My Heading`).
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-96 w-full" />
                ) : (
                  <div className="space-y-2">
                    <Controller
                      name="privacyPolicy"
                      control={form.control}
                      render={({ field }) => (
                         <Textarea 
                            className="min-h-[400px]" 
                            placeholder="Enter your privacy policy here..."
                            {...field}
                         />
                      )}
                    />
                    {form.formState.errors.privacyPolicy && <p className="text-sm text-destructive mt-1">{form.formState.errors.privacyPolicy.message}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving || loading}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
