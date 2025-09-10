"use client";

import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const contactInfo = [
  {
    icon: <MailIcon />,
    label: "Email",
    value: "awplhelper@gmail.com",
  },
  {
    icon: <PhoneIcon />,
    label: "Phone",
    value: "+91 7668710673",
  },
  {
    icon: <MapPinIcon />,
    label: "Address",
    value: "Uttrakhand, India",
    className: "col-span-2",
  },
];

const generateMailto = (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  const recipientEmail = "awplhelper@gmail.com";
  const subject = "Contact Form Submission from " + (name || "Website Visitor");
  const body = `
Name: ${name || "Not provided"}
Email: ${email || "Not provided"}
Phone: ${phone || "Not provided"}

Message:
${message || "No message provided"}

---
This message was sent from the AWPL Helper contact form.
  `.trim();

  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  // Open the user's email client
  window.location.href = mailtoLink;
};

export function Contact() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    generateMailto(formData);
  };
  return (
    <section
      id="contact"
      className="relative flex h-full size-full my-20 w-full items-center justify-center p-4"
    >
      <div className="mx-auto max-w-5xl">
        <div className="bg-card relative grid rounded-xl md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between lg:col-span-2"
          >
            <div className="relative h-full space-y-4 px-4 py-8 md:p-8">
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                Get in touch
              </h1>
              <p className="text-muted-foreground max-w-xl text-sm md:text-base lg:text-lg">
                If you have any questions regarding our Services or need help,
                please fill out the form here. We do our best to respond within
                1 business day.
              </p>
              <div className="grid gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                {contactInfo?.map((info, index) => (
                  <div key={index} className="flex items-center gap-3 py-3">
                    <div className="bg-muted/40 rounded-xl p-3">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-medium">{info.label}</p>
                      <p className="text-muted-foreground text-xs">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-muted/10 flex h-full w-full rounded-xl items-center border p-5 md:col-span-1"
          >
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input name="name" id="name" type="text" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" id="email" type="email" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input name="phone" id="phone" type="tel" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea name="message" id="message" required />
              </div>
              <Button className="w-full" type="submit">
                Send Email
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
