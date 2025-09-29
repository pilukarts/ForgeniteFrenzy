
"use client";

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactForm: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = (data) => {
    console.log('Contact Form Submitted:', data);
    // Here you would typically send the data to a backend or email service
    toast({
      title: 'Message Sent (Simulated)',
      description: 'Your message has been logged to the console. In a real app, this would be sent to support.',
    });
    form.reset();
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-card text-card-foreground shadow-xl">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-headline text-primary">Send Us a Message</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Have questions or need assistance? Fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} className="bg-input border-border focus:ring-primary h-9 sm:h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} className="bg-input border-border focus:ring-primary h-9 sm:h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Issue Subject" {...field} className="bg-input border-border focus:ring-primary h-9 sm:h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your issue or question in detail..."
                      {...field}
                      className="bg-input border-border focus:ring-primary min-h-[100px] sm:min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-2 sm:py-2.5" size="lg" disabled={form.formState.isSubmitting}>
              <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Send Message
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
