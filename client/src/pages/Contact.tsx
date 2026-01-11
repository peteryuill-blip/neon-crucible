import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setStatus("success");
      setFormData({ name: "", email: "", projectType: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    },
    onError: () => {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    contactMutation.mutate(formData);
  };

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 sm:pb-24">
      {/* Header */}
      <header className="space-y-4 sm:space-y-8 max-w-4xl">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tighter">CONTACT</h1>
        <div className="font-mono text-xs sm:text-sm text-primary border-l-2 border-primary pl-3 sm:pl-4">
          COMMISSIONS | INQUIRIES | COLLABORATIONS
        </div>
        <div className="font-serif text-sm sm:text-lg leading-relaxed text-muted-foreground pt-4">
          <p>
            For commission inquiries, collector questions, exhibition proposals, or general correspondence, please use the form below. Peter Yuill personally reviews all messages and responds within 48 hours.
          </p>
        </div>
      </header>

      <Separator className="bg-border max-w-4xl" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 max-w-6xl">
        {/* Contact Form */}
        <section className="space-y-6">
          <h2 className="font-mono text-[10px] sm:text-sm tracking-widest text-primary">SEND A MESSAGE</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="font-mono text-xs text-muted-foreground">
                NAME *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                required
                className="bg-background border-border"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="font-mono text-xs text-muted-foreground">
                EMAIL *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
                className="bg-background border-border"
              />
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <label htmlFor="projectType" className="font-mono text-xs text-muted-foreground">
                PROJECT TYPE
              </label>
              <Select
                value={formData.projectType}
                onValueChange={(value) => setFormData({ ...formData, projectType: value })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commission">Commission Inquiry</SelectItem>
                  <SelectItem value="collector">Collector / Purchase</SelectItem>
                  <SelectItem value="exhibition">Exhibition Proposal</SelectItem>
                  <SelectItem value="press">Press / Media</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="font-mono text-xs text-muted-foreground">
                MESSAGE *
              </label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project, inquiry, or question..."
                required
                rows={8}
                className="bg-background border-border resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {status === "sending" ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-pulse" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>

            {/* Status Messages */}
            {status === "success" && (
              <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Message sent successfully! Peter will respond within 48 hours.</span>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to send message. Please check all required fields and try again.</span>
              </div>
            )}
          </form>
        </section>

        {/* Contact Information */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-mono text-[10px] sm:text-sm tracking-widest text-primary">DIRECT CONTACT</h2>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground text-xs mb-1">EMAIL</p>
                  <a href="mailto:peteryuill@gmail.com" className="text-foreground hover:text-primary transition-colors">
                    peteryuill@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="space-y-4">
            <h3 className="font-mono text-[10px] sm:text-sm tracking-widest text-primary">RESPONSE TIME</h3>
            <p className="font-serif text-sm leading-relaxed text-muted-foreground">
              All inquiries are personally reviewed by Peter Yuill. Expect a response within 48 hours during business days. For urgent commission deadlines or time-sensitive projects, please indicate this in your message.
            </p>
          </div>

          <Separator className="bg-border" />

          <div className="space-y-4">
            <h3 className="font-mono text-[10px] sm:text-sm tracking-widest text-primary">COMMISSION PROCESS</h3>
            <div className="space-y-3 font-serif text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Lead time:</strong> 3-6 months for new commissions
              </p>
              <p>
                <strong className="text-foreground">Availability:</strong> Currently accepting commissions for 2025-2026
              </p>
              <p>
                <strong className="text-foreground">Process:</strong> Initial consultation → Concept development → Approval → Creation → Installation
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
