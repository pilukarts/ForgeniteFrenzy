
"use client";

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const NewsletterSignup: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<NewsletterFormValues> = (data) => {
    console.log('Newsletter Signup Submitted:', data);
    // In a real application, you would send this to your email marketing service (e.g., Mailchimp, SendGrid).
    toast({
      title: 'Subscription Successful! (Simulated)',
      description: "We've added your email to our mailing list. Thank you for your support!",
    });
    form.reset();
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-card text-card-foreground shadow-xl">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-headline text-primary flex items-center">
          <Mail className="mr-2 h-6 w-6" /> Stay Updated
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Sign up to get the latest news, updates, and special offers for Alliance Forge.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      {...field} 
                      className="bg-input border-border focus:ring-primary h-11 text-base" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-2.5" size="lg" disabled={form.formState.isSubmitting}>
              Subscribe
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;
