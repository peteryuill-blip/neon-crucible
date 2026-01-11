import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";

// Contact form submission schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  projectType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export const contactRouter = router({
  submit: publicProcedure
    .input(contactSchema)
    .mutation(async ({ input }) => {
      // In a production environment, you would send an actual email here
      // For now, we'll log it and return success
      console.log("Contact form submission:", {
        to: "peteryuill@gmail.com",
        from: input.email,
        name: input.name,
        projectType: input.projectType || "Not specified",
        message: input.message,
        timestamp: new Date().toISOString()
      });

      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      // Example with SendGrid:
      // await sendEmail({
      //   to: "peteryuill@gmail.com",
      //   from: "noreply@neon-crucible.com",
      //   replyTo: input.email,
      //   subject: `Contact Form: ${input.projectType || "General Inquiry"} from ${input.name}`,
      //   text: `
      //     Name: ${input.name}
      //     Email: ${input.email}
      //     Project Type: ${input.projectType || "Not specified"}
      //     
      //     Message:
      //     ${input.message}
      //   `
      // });

      return {
        success: true,
        message: "Your message has been sent successfully"
      };
    })
});
