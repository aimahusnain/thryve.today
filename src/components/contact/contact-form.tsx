"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FormErrors = {
  [key: string]: string;
};

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    country: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully!", {
          description: "Thank you for contacting us. We will get back to you as soon as possible.",
          duration: 5000,
        });
        
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          country: "",
          message: "",
        });
      } else {
        const result = await response.json();
        toast.error("Failed to send message", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: "Please try again later.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-background dark:bg-zinc-950 text-foreground rounded-3xl border border-border">
      <CardHeader className="space-y-1 mb-2">
        <Mail className="h-5 w-5 mb-2 text-primary" />
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Contact us</h2>
        </div>
        <p className="text-muted-foreground">
          Talk to our instructors about your enterprise needs.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstname"
                placeholder="Jonathan"
                value={formData.firstname}
                onChange={handleChange}
                className={`bg-muted/50 dark:bg-zinc-900 border-input ${
                  errors.firstname ? "border-red-500" : ""
                }`}
              />
              {errors.firstname && (
                <p className="text-sm text-red-500 mt-1">{errors.firstname}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastname"
                placeholder="Jones"
                value={formData.lastname}
                onChange={handleChange}
                className={`bg-muted/50 dark:bg-zinc-900 border-input ${
                  errors.lastname ? "border-red-500" : ""
                }`}
              />
              {errors.lastname && (
                <p className="text-sm text-red-500 mt-1">{errors.lastname}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jordel12@gmail.com"
              className={`bg-muted/50 dark:bg-zinc-900 border-input ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1"
                className={`bg-muted/50 dark:bg-zinc-900 border-input ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                className={`bg-muted/50 dark:bg-zinc-900 border-input ${
                  errors.country ? "border-red-500" : ""
                }`}
              />
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="mt-2">
            <Label htmlFor="message">How can we help?</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Other notes"
              className={`min-h-[160px] mt-2 max-h-[194px] bg-muted/50 dark:bg-zinc-900 border-input ${
                errors.message ? "border-red-500" : ""
              }`}
            />
            {errors.message && (
              <p className="text-sm text-red-500 mt-1">{errors.message}</p>
            )}

            <Button
              variant="secondary"
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Contact Thryve"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}