import { useState, useEffect } from "react";
import { Review, FAQ, Service, SocialLink } from "@/types";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Не выполняем запросы на сервере
    if (typeof window === "undefined") return;

    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) throw new Error("Ошибка загрузки отзывов");
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { reviews, loading, error };
}

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Не выполняем запросы на сервере
    if (typeof window === "undefined") return;

    const fetchFAQs = async () => {
      try {
        const response = await fetch("/api/faqs");
        if (!response.ok) throw new Error("Ошибка загрузки FAQ");
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return { faqs, loading, error };
}

export function useServices(category?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Не выполняем запросы на сервере
    if (typeof window === "undefined") return;

    const fetchServices = async () => {
      try {
        const url = category
          ? `/api/services?category=${category}`
          : "/api/services";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Ошибка загрузки услуг");
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

  return { services, loading, error };
}

export function useSocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Не выполняем запросы на сервере
    if (typeof window === "undefined") return;

    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/social-links");
        if (!response.ok) throw new Error("Ошибка загрузки социальных сетей");
        const data = await response.json();
        setSocialLinks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  return { socialLinks, loading, error };
}
