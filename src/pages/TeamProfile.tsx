import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Leaf,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";

import { team } from "@/data/team";
import { Button } from "@/components/ui/button";
import SectionFadeIn from "@/components/SectionFadeIn";

const TeamProfile = () => {
  const { id } = useParams<{ id: string }>();

  const member = team.find((person) => person.id === id);

  if (!member) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">
          Team Member Not Found
        </h1>

        <p className="text-muted-foreground mt-3">
          The requested profile could not be found.
        </p>

        <Button asChild className="mt-6">
          <Link to="/about">
            Return to About Us
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Profile Header */}
      <section className="section-padding bg-muted/40">
        <div className="container-narrow">

          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-primary mb-8 hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Our Team
          </Link>

          <div className="grid md:grid-cols-[300px_1fr] gap-10 items-center">

            {/* Member Photograph */}
            <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-muted shadow-lg">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full gradient-green flex items-center justify-center text-primary-foreground text-8xl font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Basic Details */}
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                DSC Society / Our Team
              </span>

              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-4">
                {member.name}
              </h1>

              <p className="text-primary font-semibold text-lg mt-3">
                {member.role}
              </p>

              <p className="text-muted-foreground leading-relaxed mt-6">
                {member.shortBio}
              </p>

              <div className="mt-6 space-y-4">

                <div className="flex items-start gap-3">
                  <GraduationCap className="text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold">
                      Educational Qualification
                    </p>
                    <p className="text-muted-foreground">
                      {member.qualification}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BriefcaseBusiness className="text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold">
                      Current Position
                    </p>
                    <p className="text-muted-foreground">
                      {member.currentWork}
                    </p>
                  </div>
                </div>

                {member.origin && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold">
                        Background
                      </p>
                      <p className="text-muted-foreground">
                        {member.origin}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Biography */}
      <SectionFadeIn>
        <section className="section-padding">
          <div className="container-narrow max-w-4xl">

            <div className="mb-10">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Personal Journey
              </span>

              <h2 className="font-heading text-3xl font-bold mt-3 mb-6">
                About {member.name}
              </h2>

              <p className="text-muted-foreground leading-8 text-base md:text-lg whitespace-pre-line">
                {member.biography}
              </p>
            </div>

            {/* Areas of Interest */}
            <div className="glass-card p-6 md:p-8">
              <h3 className="font-heading text-2xl font-bold mb-6">
                Areas of Interest
              </h3>

              <div className="flex flex-wrap gap-3">
                {member.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-3 text-sm"
                  >
                    <Leaf size={16} className="text-primary" />
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Return Button */}
            <div className="text-center mt-12">
              <Button asChild>
                <Link to="/about">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Our Team
                </Link>
              </Button>
            </div>

          </div>
        </section>
      </SectionFadeIn>
    </div>
  );
};

export default TeamProfile;
