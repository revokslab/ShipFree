"use client";

import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { SiThreads } from "react-icons/si";
import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "¡Awesome project! Create products or startups faster. ¡This open-source template has everything you need!\n\n$ git clone shipfree",
      name: "Miguel Ángel Durán",
      title: "@midudev",
      avatar: "/testimonial-image1.jpg",
      avatarType: "image",
      twitterLink: "https://x.com/midudev/status/1889327503207960690",
      verified: true,
    },
    {
      quote: "ShipFree is a free alternative to ShipFast, designed to simplify and optimize your shipping process.",
      name: "developer.joy",
      title: "@developer.joy",
      avatar: "/testimonial-image2.png",
      avatarType: "image",
      threadsLink: "https://www.threads.com/@developer.joy/post/DGisRsoIAuE/shipfree-is-a-free-alternative-to-shipfast-designed-to-simplify-and-optimize-you?hl=en",
    },
    {
      quote: "I'm not even exaggerating - this saved me weeks of work.\nInstead of fighting errors and configs, I actually built features.\nIt's the first time I've felt in control of the entire launch process.",
      name: "Bong",
      title: "Indie Builder",
      avatar: "/testimonial-image3.png",
      avatarType: "image",
    },
    {
      quote: "I've used other Next.js starters but this one feels built by someone who's actually shipped.\nThe little details - onboarding, SEO, dashboard flow - make it production-grade out of the box.",
      name: "David Alejandro",
      title: "Full-Stack Developer",
      avatar: "/testimonial-image4.png",
      avatarType: "image",
    },
    {
      quote: "Bought it on a Friday night, had a live SaaS by Sunday.\nEverything just clicked - no roadblocks, no setup headaches.",
      name: "Finn Sheng",
      title: "SaaS Founder",
      avatar: "/testimonial-image5.png",
      avatarType: "image",
    },
    {
      quote: "I was burned out from endless setup and half-working templates.\nThis made me fall in love with building again.\nI opened my laptop, ran one command, and started designing instead of debugging.",
      name: "Fabian Andres Parra Sanchez",
      title: "Product Builder",
      avatar: "/testimonial-image6.png",
      avatarType: "image",
    },
  ];

  return (
    <section id="wall-of-love" className="py-24 bg-[#F4F4F5]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-sm font-medium text-muted-foreground mb-8" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          TESTIMONIALS
        </h2>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            Trusted by developers
          </h2>
          <p className="text-lg text-muted-foreground">
            See what builders are saying about ShipFree
          </p>
        </div>

        <div className="border border-[#E4E4E7] rounded-none overflow-hidden bg-transparent">
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-4 bg-transparent flex flex-col relative ${
                  index % 3 !== 2 ? 'border-r border-[#E4E4E7]' : ''
                } ${
                  index < 3 ? 'border-b border-[#E4E4E7]' : ''
                }`}
              >
                {/* Quote */}
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                  "{testimonial.quote}"
                </p>

                {/* Profile */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {testimonial.avatarType === "image" ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground">
                        {testimonial.avatar}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                  {testimonial.twitterLink && (
                    <Link
                      href={testimonial.twitterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FaXTwitter className="h-5 w-5" />
                    </Link>
                  )}
                  {testimonial.threadsLink && (
                    <Link
                      href={testimonial.threadsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <SiThreads className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

