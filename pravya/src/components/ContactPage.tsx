import { Mail, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Get in Touch</h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Have a question, feedback, or need support? We'd love to hear from you. Fill out the form below, and our team will get back to you as soon as possible.
        </p>
      </div>

      <Card className="w-full max-w-2xl bg-gray-900/50 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Send us a Message</CardTitle>
          <CardDescription className="text-gray-400">
            Please provide your details, and we'll respond shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="name" placeholder="John Doe" className="pl-10 bg-gray-800 border-gray-700 focus:ring-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="email" type="email" placeholder="john.doe@example.com" className="pl-10 bg-gray-800 border-gray-700 focus:ring-white" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Feedback on Interview Analysis" className="bg-gray-800 border-gray-700 focus:ring-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <Textarea id="message" placeholder="Type your detailed message here..." className="pl-10 min-h-[150px] bg-gray-800 border-gray-700 focus:ring-white" />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 text-base">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
