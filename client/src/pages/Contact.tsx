import { Mail, Phone, Instagram } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4 border-l-2 border-primary pl-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          CONTACT
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          For commission inquiries, collector questions, exhibition opportunities, or press requests.
        </p>
      </div>

      {/* Contact Information */}
      <div className="space-y-8 pt-8">
        {/* Email */}
        <div className="flex items-start gap-4 group">
          <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Mail className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono text-sm text-muted-foreground mb-2">EMAIL</h3>
            <a 
              href="mailto:peteryuill@gmail.com"
              className="text-2xl md:text-3xl font-light hover:text-primary transition-colors duration-300"
            >
              peteryuill@gmail.com
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4 group">
          <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Phone className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono text-sm text-muted-foreground mb-2">PHONE</h3>
            <a 
              href="tel:+85259326869"
              className="text-2xl md:text-3xl font-light hover:text-primary transition-colors duration-300"
            >
              +852 5932 6869
            </a>
          </div>
        </div>

        {/* Instagram */}
        <div className="flex items-start gap-4 group">
          <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Instagram className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono text-sm text-muted-foreground mb-2">INSTAGRAM</h3>
            <a 
              href="https://instagram.com/peteryuill"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl md:text-3xl font-light hover:text-primary transition-colors duration-300"
            >
              @peteryuill
            </a>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Based in Bangkok, Thailand. Available for commissions, exhibitions, and collaborations worldwide. 
          Typical response time: 24-48 hours.
        </p>
      </div>
    </div>
  );
}
