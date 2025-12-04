import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { getExperiences, type Experience } from "../services/dataService";
import { resolveMediaUrl } from "../utils/mediaResolver";

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (
    start: string,
    end: string | undefined,
    current: boolean
  ) => {
    if (current) {
      return `${start} - Present`;
    }
    return `${start} - ${end || "Present"}`;
  };

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <p className="text-muted-foreground">Loading experiences...</p>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          Work Experience
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10"></div>

                {/* Content card */}
                <div className="w-full md:w-[calc(50%-2rem)]">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {exp.companyLogo && (
                          <img
                            src={resolveMediaUrl(exp.companyLogo)}
                            alt={exp.company}
                            className="w-12 h-12 object-contain rounded"
                          />
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">
                            {exp.position}
                          </CardTitle>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-2 font-semibold text-foreground">
                              <Briefcase className="w-4 h-4" />
                              {exp.company}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-3 h-3" />
                              {formatDateRange(
                                exp.startDate,
                                exp.endDate,
                                exp.current
                              )}
                            </div>
                            {exp.location && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-3 h-3" />
                                {exp.location}
                              </div>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="text-foreground mb-4 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block w-[calc(50%-2rem)]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
