import React from "react";
import { Link } from "react-router-dom";
import { Film, Briefcase, Bot, Music, Gamepad2, Lock, BookOpen, MoreHorizontal } from 'lucide-react'; // Changed ShoppingBag to MoreHorizontal

const categories = [
  {
    name: "Streaming",
    icon: <Film />,
    value: "streaming",
    description: "Premium content in 4K",
    color: "#FF5E5E",
    gradient: "linear-gradient(to bottom, #FF5E5E, #FF3D3D, #FF7E61)"
  },
  {
    name: "Softwares",
    icon: <Briefcase />,
    value: "software",
    description: "Boost your workflow",
    color: "#2EFFAD",
    gradient: "linear-gradient(to bottom, #2EFFAD, #3DFF83, #61FF7E)"
  },
  {
    name: "AI Tools",
    icon: <Bot />,
    value: "ai",
    description: "Cutting-edge technology",
    color: "#7E61FF",
    gradient: "linear-gradient(to bottom, #2EADFF, #3D83FF, #7E61FF)"
  },
  {
    name: "Music",
    icon: <Music />,
    value: "music",
    description: "Unlimited streaming",
    color: "#FF61F7",
    gradient: "linear-gradient(to bottom, #FF2EAD, #FF3D83, #FF617E)"
  },
  {
    name: "Gaming",
    icon: <Gamepad2 />,
    value: "gaming",
    description: "Exclusive titles",
    color: "#61FF7E",
    gradient: "linear-gradient(to bottom, #ADFF2E, #83FF3D, #61FF7E)"
  },
  {
    name: "VPN",
    icon: <Lock />,
    value: "vpn",
    description: "Secure Browse",
    color: "#5E5EFF",
    gradient: "linear-gradient(to bottom, #5E5EFF, #3D3DFF, #617EFF)"
  },
  {
    name: "Education",
    icon: <BookOpen />,
    value: "education",
    description: "Learn without limits",
    color: "#FFAD2E",
    gradient: "linear-gradient(to bottom, #FFAD2E, #FF833D, #FF7E61)"
  },
  { // Changed to "Others" Category
    name: "Others", // Changed from "Subscriptions"
    icon: <MoreHorizontal />, // Changed icon
    value: "others", // Changed from "subscriptions"
    description: "Explore more options", // Changed description
    color: "#A0A0A0", // Example neutral color, feel free to change
    gradient: "linear-gradient(to bottom, #A0A0A0, #888888, #B8B8B8)" // Example neutral gradient
  },
];

function CategoriesSection() {
  return (
    <section className="mb-16 px-6 py-12 max-w-7xl mx-auto">
      <div className="px-4 mb-12">
        <h2 className="text-4xl font-bold text-white tracking-tight">
          categories
          <span className="block text-5xl font-light mt-2">discover more</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {categories.map((category) => (
          <div key={category.value} className="flex justify-center">
            <Link
              to={`/category/${category.value}`}
              className="notification relative flex flex-col w-full max-w-xs hover:scale-[1.02] transition-transform duration-300"
              style={{
                '--gradient': category.gradient,
                '--color': category.color,
                height: '9rem'
              }}
            >
              <div className="notiglow"></div>
              <div className="notiborderglow"></div>
              <div className="flex items-center notititle gap-3 pl-5 pt-4">
                <span className="text-current">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="notibody pl-5 pt-1">{category.description}</div>

              <style jsx>{`
                .notification {
                  display: flex;
                  flex-direction: column;
                  isolation: isolate;
                  position: relative;
                  background: #29292c;
                  border-radius: 1rem;
                  overflow: hidden;
                  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                  font-size: 16px;
                }

                .notification:before {
                  position: absolute;
                  content: "";
                  inset: 0.0625rem;
                  border-radius: 0.9375rem;
                  background: #18181b;
                  z-index: 2;
                }

                .notification:after {
                  position: absolute;
                  content: "";
                  width: 0.25rem;
                  inset: 0.65rem auto 0.65rem 0.5rem;
                  border-radius: 0.125rem;
                  background: var(--gradient);
                  transition: transform 300ms ease;
                  z-index: 4;
                }

                .notification:hover:after {
                  transform: translateX(0.15rem);
                }

                .notititle {
                  color: var(--color);
                  font-weight: 500;
                  font-size: 1.1rem;
                  transition: transform 300ms ease;
                  z-index: 5;
                }

                .notification:hover .notititle {
                  transform: translateX(0.15rem);
                }

                .notibody {
                  color: #99999d;
                  transition: transform 300ms ease;
                  z-index: 5;
                }

                .notification:hover .notibody {
                  transform: translateX(0.25rem);
                }

                .notiglow,
                .notiborderglow {
                  position: absolute;
                  width: 20rem;
                  height: 20rem;
                  transform: translate(-50%, -50%);
                  background: radial-gradient(
                    circle closest-side at center,
                    white,
                    transparent
                  );
                  opacity: 0;
                  transition: opacity 300ms ease;
                }

                .notiglow {
                  z-index: 3;
                }

                .notiborderglow {
                  z-index: 1;
                }

                .notification:hover .notiglow {
                  opacity: 0.1;
                }

                .notification:hover .notiborderglow {
                  opacity: 0.1;
                }
              `}</style>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;