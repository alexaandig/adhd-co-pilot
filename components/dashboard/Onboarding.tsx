'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDashboard } from './DashboardProvider';

const onboardingSchema = z.object({
  peakHours: z.string({ required_error: 'Please select your peak hours.' }),
  derailer: z.string({ required_error: 'Please select what derails you most.' }),
  motivator: z.string({ required_error: 'Please select what motivates you.' }),
  medication: z.string({ required_error: 'Please select an option.' }),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

const peakHoursOptions = ['6-10am', '10am-2pm', '2-6pm', '6pm-midnight', 'It varies wildly'];
const derailerOptions = ['Can\'t start', 'Can\'t finish', 'Can\'t focus', 'Forget tasks exist'];
const motivatorOptions = ['Urgency', 'Novelty', 'Helping others', 'Spite (yes, really)'];
const medicationOptions = ['Yes, consistent', 'Yes, sometimes', 'No', 'Prefer not to say'];

export function Onboarding() {
  const { completeOnboarding } = useDashboard();
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
  });

  function onSubmit(data: OnboardingValues) {
    completeOnboarding(data);
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Welcome to ADHD Co-Pilot!</CardTitle>
          <CardDescription>
            Just a few quick questions to help us understand your brain. This will take less than 60 seconds.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="peakHours"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-bold text-lg">When is your brain sharpest?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        {peakHoursOptions.map((option) => (
                          <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal">{option}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="derailer"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-bold text-lg">What derails you most?</FormLabel>
                    <FormControl>
                       <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        {derailerOptions.map((option) => (
                           <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal">{option}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motivator"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-bold text-lg">What motivates you?</FormLabel>
                    <FormControl>
                       <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        {motivatorOptions.map((option) => (
                           <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal">{option}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medication"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-bold text-lg">Medication? (optional)</FormLabel>
                    <FormControl>
                       <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        {medicationOptions.map((option) => (
                           <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal">{option}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full">Let's Go! &rarr;</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
