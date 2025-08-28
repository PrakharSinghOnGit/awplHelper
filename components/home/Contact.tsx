"use client";

import React from "react";
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

export function Contact() {
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
            <form action="" className="w-full space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input type="email" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Phone</Label>
                <Input type="phone" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Message</Label>
                <Textarea />
              </div>
              <Button className="w-full" type="button">
                Submit
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
