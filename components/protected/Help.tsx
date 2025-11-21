"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Target,
  CreditCard,
  Download,
  Smartphone,
  Search,
  Save,
  Trash2,
  Edit3,
  Shield,
  Mail,
  Link,
} from "lucide-react";

const HelpPage = () => {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about using AWPL Helper
        </p>
      </div>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                1
              </div>
              <h3 className="font-semibold">Create Account</h3>
              <p className="text-sm text-muted-foreground">
                Sign up with your email to get started with AWPL Helper
              </p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                2
              </div>
              <h3 className="font-semibold">Add Team Members</h3>
              <p className="text-sm text-muted-foreground">
                Navigate to Team Management and add your AWPL team members
              </p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                3
              </div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor levels, targets, and payments in the dashboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {/* Team Management FAQs */}
            <AccordionItem value="team-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  How do I add a new team member?
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p>To add a new team member:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Go to the Team Management page</li>
                  <li>Click the &quot;Add Member&quot; button</li>
                  <li>
                    Fill in the required fields: Name, AWPL ID, and AWPL
                    Password
                  </li>
                  <li>Click &quot;Save&quot; to add the member to your team</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Note:</strong> All fields marked with * are required
                  before saving.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="team-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  How do I edit team member information?
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p>Team members can be edited inline:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>
                    Click directly on any field (Name, AWPL ID, or Password) in
                    the table
                  </li>
                  <li>Edit the text directly</li>
                  <li>Changes are tracked automatically</li>
                  <li>Modified rows will be highlighted in yellow</li>
                  <li>Click &quot;Save&quot; to persist your changes</li>
                </ol>
                <Badge variant="outline" className="mt-2">
                  💡 Tip: You&apos;ll see a warning banner if you have unsaved
                  changes
                </Badge>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="team-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  How do I remove team members?
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p>To remove team members:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>
                    Select the checkbox next to the member(s) you want to remove
                  </li>
                  <li>Click the &quot;Remove&quot; button</li>
                  <li>Confirm the deletion in the dialog</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Warning:</strong> This action cannot be undone. Make
                  sure you&apos;ve saved important data before removing members.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="search">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  How does the search feature work?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  The search bar allows you to quickly find team members by
                  searching across multiple fields:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>Member Name</li>
                  <li>AWPL ID</li>
                  <li>AWPL Password</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Simply type any part of the information you&apos;re looking
                  for, and the table will automatically filter to show matching
                  results. The search is case-insensitive.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="unsaved">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  What happens if I forget to save my changes?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>AWPL Helper has built-in protection for unsaved changes:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>
                    A yellow banner appears at the top when you have unsaved
                    changes
                  </li>
                  <li>
                    The Save button turns orange and shows &quot;Save
                    Changes&quot;
                  </li>
                  <li>
                    Modified rows are highlighted with a yellow background
                  </li>
                  <li>
                    Your browser will warn you if you try to close the page with
                    unsaved changes
                  </li>
                  <li>Changes are temporarily saved to local storage</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Data Tracking FAQs */}
            <AccordionItem value="levels">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  How are levels calculated?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Team member levels are automatically calculated based on their
                  progress in the AWPL system:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>
                    <strong>SAO Level:</strong> Calculated from SAO-related
                    activities
                  </li>
                  <li>
                    <strong>SGO Level:</strong> Calculated from SGO-related
                    activities
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Levels are updated automatically when you sync data from AWPL.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="targets">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  What is target data?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Target data helps you track goals and objectives for your team
                  members. You can view and manage target completion status to
                  monitor progress toward milestones.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cheques">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  How do I track payments and cheques?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  The cheque data feature allows you to keep track of payments
                  and financial transactions for your team members. This helps
                  ensure accurate record-keeping and payment tracking.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* PWA Installation */}
            <AccordionItem value="pwa">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Can I install this as a mobile app?
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p>
                  Yes! AWPL Helper is a Progressive Web App (PWA) that can be
                  installed on your device for a native app-like experience.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Installation Instructions:
                  </h4>
                  <div className="space-y-3 ml-2">
                    <div>
                      <Badge variant="secondary">Android / Chrome</Badge>
                      <p className="text-sm mt-1">
                        Tap the menu (⋮) → &quot;Install app&quot; or &quot;Add
                        to Home screen&quot;
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary">iPhone / Safari</Badge>
                      <p className="text-sm mt-1">
                        Tap the Share button (□↑) → &quot;Add to Home
                        Screen&quot;
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary">Desktop Chrome</Badge>
                      <p className="text-sm mt-1">
                        Click the install icon (⊕) in the address bar or open
                        menu → &quot;Install AWPL Helper&quot;
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Benefits: Works offline, faster loading, appears in your app
                  drawer, and provides push notifications.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Security & Privacy */}
            <AccordionItem value="security">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Is my data secure?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>Yes, we take security seriously:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>All data is encrypted in transit using HTTPS</li>
                  <li>Your data is stored securely using Supabase</li>
                  <li>
                    Authentication is handled with industry-standard security
                    practices
                  </li>
                  <li>Only you can access your team&apos;s data</li>
                  <li>We never share your data with third parties</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Need More Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? We&apos;re here to
            help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:support@awplhelper.com"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tips & Tricks */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Use keyboard shortcuts: Press Enter to save when editing a field
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Sort columns by clicking on the column headers</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Select multiple members by holding Shift and clicking checkboxes
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Regular backups: Your data is automatically synced to the cloud
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Install the PWA for offline access to your team data</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
