import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Исключаем node-telegram-bot-api из клиентского бандла
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        "supports-color": false,
      };
    }

    // Игнорируем предупреждения для node-telegram-bot-api
    config.ignoreWarnings = [
      { module: /node-telegram-bot-api/ },
      { file: /node_modules\/node-telegram-bot-api/ },
    ];

    return config;
  },
  serverExternalPackages: ["node-telegram-bot-api"],
};

export default nextConfig;
