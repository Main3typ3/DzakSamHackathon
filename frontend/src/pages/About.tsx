import { Github, Linkedin, Twitter, Instagram, Mail, ExternalLink } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

interface Founder {
  name: string;
  role: string;
  image: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
  bio: string;
  socials: SocialLink[];
}

const founders: Founder[] = [
  {
    name: "Amir Dzakwan",
    role: "Co-Founder & Developer",
    image: "/team/amir.jpg",
    initials: "AD",
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
    bio: "Passionate about blockchain technology and making Web3 education accessible to everyone. Building the future of decentralized learning.",
    socials: [
      {
        name: "GitHub",
        url: "https://github.com/Main3typ3",
        icon: <Github className="w-5 h-5" />,
        color: "hover:bg-gray-700"
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/amirdzakwan",
        icon: <Linkedin className="w-5 h-5" />,
        color: "hover:bg-blue-600"
      },
      {
        name: "Twitter",
        url: "https://twitter.com/amirdzakwan",
        icon: <Twitter className="w-5 h-5" />,
        color: "hover:bg-sky-500"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/amirdzakwan",
        icon: <Instagram className="w-5 h-5" />,
        color: "hover:bg-pink-600"
      },
      {
        name: "Email",
        url: "mailto:amir@chainquest.academy",
        icon: <Mail className="w-5 h-5" />,
        color: "hover:bg-red-500"
      }
    ]
  },
  {
    name: "Sam Maine",
    role: "Co-Founder & Designer",
    image: "/team/sam.jpg",
    initials: "SM",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    bio: "Creative visionary with a passion for user experience and blockchain innovation. Dedicated to making crypto education engaging and fun.",
    socials: [
      {
        name: "GitHub",
        url: "https://github.com/sammaine",
        icon: <Github className="w-5 h-5" />,
        color: "hover:bg-gray-700"
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/sammaine",
        icon: <Linkedin className="w-5 h-5" />,
        color: "hover:bg-blue-600"
      },
      {
        name: "Twitter",
        url: "https://twitter.com/sammaine",
        icon: <Twitter className="w-5 h-5" />,
        color: "hover:bg-sky-500"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/sammaine",
        icon: <Instagram className="w-5 h-5" />,
        color: "hover:bg-pink-600"
      },
      {
        name: "Email",
        url: "mailto:sam@chainquest.academy",
        icon: <Mail className="w-5 h-5" />,
        color: "hover:bg-red-500"
      }
    ]
  }
];

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet the Team
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're on a mission to make blockchain education accessible, 
            engaging, and fun for everyone.
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {founders.map((founder) => (
            <div
              key={founder.name}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-purple-500/50 shadow-lg shadow-purple-500/20">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {founder.name}
                </h2>
                <p className="text-purple-400 font-medium mb-4">
                  {founder.role}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {founder.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-3 flex-wrap">
                {founder.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-white/10 text-white transition-all duration-300 ${social.color} hover:scale-110`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              ChainQuest Academy was born from a simple idea: learning blockchain 
              technology should be as exciting as the technology itself. We combine 
              gamification, AI-powered tutoring, and interactive lessons to create 
              an educational experience that's both effective and enjoyable.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <a
                href="https://github.com/Main3typ3/DzakSamHackathon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
              <a
                href="/learn"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5" />
                Start Learning
              </a>
            </div>
          </div>
        </div>

        {/* Built for Hackathon */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>
            Built with ❤️ for the Scoop AI Hackathon 2025
          </p>
        </div>
      </div>
    </div>
  );
}
