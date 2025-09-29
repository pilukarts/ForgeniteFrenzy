
"use client";

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquarePlus, Bug, Lightbulb, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const feedbackFormSchema = z.object({
  feedbackType: z.string().min(1, { message: "Please select a feedback type." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  // Optional fields, can be added later
  // name: z.string().optional(),
  // email: z.string().email({ message: "Please enter a valid email address." }).optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

const FeedbackForm: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedbackType: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FeedbackFormValues> = (data) => {
    console.log('Feedback Form Submitted:', data);
    // In a real application, you would send this data to a backend service,
    // a Discord webhook, or an external ticketing system.
    toast({
      title: 'Feedback Sent (Simulated)',
      description: 'Your feedback has been logged to the console. Thank you, Commander!',
    });
    form.reset();
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-card text-card-foreground shadow-xl">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-headline text-primary flex items-center">
          <MessageSquarePlus className="mr-2 h-6 w-6" /> Submit Your Report
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Your input helps us improve Alliance Forge.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="feedbackType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Type of Feedback</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:ring-primary h-9 sm:h-10">
                        <SelectValue placeholder="Select feedback type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="suggestion" className="focus:bg-primary/20">
                        <div className="flex items-center">
                          <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" /> Suggestion
                        </div>
                      </SelectItem>
                      <SelectItem value="bug_report" className="focus:bg-primary/20">
                        <div className="flex items-center">
                          <Bug className="mr-2 h-4 w-4 text-red-400" /> Bug Report
                        </div>
                      </SelectItem>
                      <SelectItem value="general_feedback" className="focus:bg-primary/20">
                        <div className="flex items-center">
                          <MessageSquarePlus className="mr-2 h-4 w-4 text-blue-400" /> General Feedback
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input placeholder="Briefly, what is this about?" {...field} className="bg-input border-border focus:ring-primary h-9 sm:h-10" />
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
                  <FormLabel className="text-sm sm:text-base">Detailed Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide as much detail as possible..."
                      {...field}
                      className="bg-input border-border focus:ring-primary min-h-[100px] sm:min-h-[120px]"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-2 sm:py-2.5" size="lg" disabled={form.formState.isSubmitting}>
              <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Submit Feedback
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
