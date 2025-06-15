"use client";

import { motion } from "framer-motion";
import { FaTiktok, FaTwitter, FaVk, FaTelegram } from "react-icons/fa";
import { useSocialLinks } from "@/hooks/useApi";
import { useRouter } from "next/navigation";

const iconMap = {
  FaTiktok,
  FaTwitter,
  FaVk,
  FaTelegram,
};

export default function WelcomeSection() {
  const { socialLinks, loading } = useSocialLinks();
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      {" "}
      <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-black via-gray-900 to-black mx-auto">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-6">
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-16 relative"
            >
              {" "}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-[22vw] sm:text-[22vw] md:text-[18vw] lg:text-[14vw] xl:text-[12vw] 2xl:text-[12rem] font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient mb-8 tracking-tighter leading-none px-4 sm:px-6"
                style={{
                  fontFamily: "Inter, system-ui",
                  backgroundSize: "200% 200%",
                }}
              >
                WEINERT
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto max-w-md"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="space-y-6 mb-16"
            >
              {" "}
              <h2 className="text-3xl md:text-4xl font-light text-white/90">
                Digital{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                  Artist
                </span>
              </h2>{" "}
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-6 sm:px-4">
                Создаю уникальные арты и иллюстрации. Воплощаю ваши идеи в
                визуальные шедевры с профессиональным качеством и вниманием к
                деталям.
              </p>
            </motion.div>{" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mb-20"
            >
              {" "}
              <motion.button
                onClick={() => router.push("/services")}
                className="border border-purple-500/30 bg-transparent text-purple-400 hover:border-purple-500/60 hover:text-white hover:bg-purple-500/10 transition-all duration-300 px-10 py-3 text-base font-medium rounded-lg"
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                Посмотреть услуги
              </motion.button>
            </motion.div>
            {!loading && socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="flex justify-center space-x-8"
              >
                {socialLinks
                  .filter((link) => link.isVisible)
                  .sort((a, b) => a.order - b.order)
                  .map((social, index) => {
                    const IconComponent =
                      iconMap[social.icon as keyof typeof iconMap];
                    if (!IconComponent) return null;

                    return (
                      <motion.a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-all duration-300"
                        whileHover={{
                          scale: 1.2,
                          y: -3,
                        }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 + index * 0.1 }}
                      >
                        <IconComponent className="w-8 h-8" />
                      </motion.a>
                    );
                  })}
              </motion.div>
            )}{" "}
          </div>
        </div>
      </section>
    </div>
  );
}
