import { Button } from "@/components/ui/button";
import { MessageCircle, Instagram, Facebook, Youtube, Twitter, Linkedin, Globe } from "lucide-react";

interface SocialNetwork {
  id: number;
  platform: string;
  url: string;
}

interface SocialLinksProps {
  socialNetworks?: SocialNetwork[];
}

export const SocialLinks = ({ socialNetworks = [] }: SocialLinksProps) => {
  // Function to get the appropriate icon based on platform name
  const getIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();

    if (platformLower.includes('whatsapp')) return MessageCircle;
    if (platformLower.includes('instagram')) return Instagram;
    if (platformLower.includes('facebook')) return Facebook;

    return Globe; // Default icon
  };

  // Function to get button variant - first one is secondary (white), rest are outline
  const getVariant = (index: number) => {
    return index === 0 ? "secondary" : "outline";
  };

  // Function to get button classes
  const getButtonClasses = (index: number) => {
    return index === 0
      ? "bg-white text-primary hover:bg-white/90"
      : "bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary";
  };

  // Don't render the section if there are no social networks
  if (socialNetworks.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-brand">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¡Únete a Nuestra Comunidad!
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Mantente informado sobre nuevas rifas, resultados y promociones exclusivas
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {socialNetworks.map((social, index) => {
              const Icon = getIcon(social.platform);

              return (
                <Button
                  key={social.id}
                  variant={getVariant(index)}
                  size="lg"
                  className={getButtonClasses(index)}
                  asChild
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {social.platform}
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
