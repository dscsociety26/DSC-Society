import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import SectionFadeIn from "@/components/SectionFadeIn";
import { toast } from "sonner";
import hero5 from "@/assets/hero-5.jpg";
import { supabase } from "@/lib/supabase";

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fullName = formData.full_name.trim();
    const email = formData.email.trim().toLowerCase();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (fullName.length < 2 || fullName.length > 100) {
      toast.error("Please enter a valid name.");
      return;
    }

    if (email.length < 5 || email.length > 254) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (subject.length < 1 || subject.length > 200) {
      toast.error("Please enter a valid subject.");
      return;
    }

    if (message.length < 1 || message.length > 5000) {
      toast.error("Please enter a message between 1 and 5000 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert({
          full_name: fullName,
          email,
          subject,
          message,
          status: "unread",
        });

      if (error) {
        throw error;
      }

      toast.success("Message sent! We'll get back to you soon.");

      setFormData({
        full_name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      toast.error("We couldn't send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={hero5}
          alt="Contact"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-dsc-dark/60" />

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              Contact Us
            </h1>

            <p className="mt-4 text-lg text-primary-foreground/80">
              We'd love to hear from you
            </p>
          </div>
        </div>
      </section>

      <SectionFadeIn>
        <section className="section-padding">
          <div className="container-narrow">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="glass-card p-8">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                  Send a Message
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  noValidate
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      maxLength={100}
                      autoComplete="name"
                      className="bg-background"
                    />

                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      className="bg-background"
                    />
                  </div>

                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    maxLength={200}
                    className="bg-background"
                  />

                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={5}
                    required
                    maxLength={5000}
                    className="bg-background"
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gradient-green border-0 text-primary-foreground font-heading font-semibold text-base py-6"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                    Get in Touch
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        icon: MapPin,
                        label: "Address",
                        value:
                          "28-7-154, Guntur, Andhra Pradesh 522002",
                      },
                      {
                        icon: Phone,
                        label: "Phone",
                        value: "+91 9703342045",
                      },
                      {
                        icon: Mail,
                        label: "Email",
                        value: "dscsociety.org@gmail.com",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl gradient-green flex items-center justify-center shrink-0">
                          <item.icon
                            size={20}
                            className="text-primary-foreground"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-foreground">
                            {item.label}
                          </p>
                          <p className="text-muted-foreground">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionFadeIn>
    </div>
  );
};

export default Contact;
