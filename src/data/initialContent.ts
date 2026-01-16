import { SiteContent } from "@/types/content";

export const initialContent: SiteContent = {
  navbar: {
    logo: "/Logo.png",
    links: [
      { label: "À propos", href: "/", sectionId: "apropos" },
      { label: "Services", href: "/services" },
      { label: "Nos appartements", href: "/appartment" },
      { label: "Contact", href: "/contact" },
    ],
    ctaButton: "Réserver maintenant",
  },
  home: {
    hero: {
      title: ["Lorem", "Ipsum", "Dolor Sit"],
      subtitle:
        "Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      ctaButton: "Réserver",
      testimonial: {
        image: "https://images.pexels.com/photos/3777570/pexels-photo-3777570.jpeg?auto=compress&cs=tinysrgb&w=200",
        name: "Lorem ipsum dolor sit amet",
        quote: "Consectetur adipiscing elit",
      },
      images: {
        main: "/image-principale-hero.png",
        secondary: "/Image-Grise-hero.png",
        tertiary: "/Image-Lit-hero.png",
      },
    },
    welcome: {
      title: "Welcome to lorem consectetur",
      description:
        "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
      features: [
        { icon: "crown", label: "Luxe & Confort" },
        { icon: "star", label: "Service Premium" },
      ],
      ctaButton: "Faire une réservation",
      images: {
        video: "/video-bg-welcome.png",
        photo1: "/photo-welcome1.png",
        photo2: "/photo-welcome2.png",
      },
    },
  },
  services: {
    hero: {
      title: ["CONSECT", "ADIPISCING", "ELIT."],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
    },
    features: [
      {
        icon: "book",
        title: "Adipiscing elit amet, consectetur.",
        description:
          "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      },
      {
        icon: "bed",
        title: "Class aptent taciti sociosqu ad",
        description:
          "Norem ipsum dolor sit amet, consectetur adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      },
      {
        icon: "utensils",
        title: "A nunc vulputate libero et velit",
        description:
          "Curabitur tempus urna at turpis condimentum lobortis. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent.",
      },
      {
        icon: "umbrella",
        title: "Curabitur tempus urna at turpis",
        description:
          "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.",
      },
    ],
    faq: [
      {
        question: "Gorem ipsum dolor sit amet, consectetur adipiscing elit.",
        answer:
          "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.",
      },
      {
        question: "Aptent taciti sociosqu ad litora torquent per conubia",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      },
      {
        question: "Curabitur tempus urna at turpis condimentum lobortis",
        answer:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
    ],
  },
  apartments: {
    hero: {
      title: ["INTERDUM,", "AC ALIQUET", "ODIO MATTIS."],
      description:
        "Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: "/hero-room.jpg",
    },
    sectionTitle: "Adipiscing elit amet consectetur.",
    sectionDescription:
      "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.",
    rooms: [
      {
        image: "/room-1.jpg",
        title: "Curabitur tempus urna at turpis",
        description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit",
        guests: "jusqu'à 4 invités",
        bedrooms: "2 chambres à coucher",
      },
      {
        image: "/room-2.jpg",
        title: "Curabitur tempus urna at turpis",
        description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit",
        guests: "jusqu'à 4 invités",
        bedrooms: "2 chambres à coucher",
      },
      {
        image: "/room-3.jpg",
        title: "Curabitur tempus urna at turpis",
        description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit",
        guests: "jusqu'à 4 invités",
        bedrooms: "2 chambres à coucher",
      },
    ],
  },
  apartmentDetail: {
    title: "Per conubia nostra, per inceptos himenaeos",
    price: 600,
    priceUnit: "Nuit",
    description:
      "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
    features: [
      {
        icon: "wifi",
        title: "Class aptent taciti torquent",
        description:
          "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      },
      {
        icon: "tv",
        title: "Per inceptos himenaeos",
        description:
          "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      },
      {
        icon: "armchair",
        title: "Velit interdum ac aliquet",
        description:
          "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      },
    ],
    images: [
      "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    amenities: [
      { icon: "wifi", label: "Wifi" },
      { icon: "bed", label: "4 chambres à coucher" },
      { icon: "trees", label: "Terrasse" },
      { icon: "car", label: "Garage" },
      { icon: "waves", label: "Piscine" },
    ],
  },
  pricing: {
    title: "Nos Tarifs",
    description:
      "Choisissez le forfait qui correspond le mieux à vos besoins de séjour.",
    plans: [
      {
        name: "Essentiel",
        price: 150,
        period: "nuit",
        features: [
          "Appartement standard",
          "Wifi inclus",
          "Petit déjeuner",
          "Service ménage quotidien",
        ],
      },
      {
        name: "Premium",
        price: 350,
        period: "nuit",
        features: [
          "Appartement deluxe",
          "Wifi haut débit",
          "Petit déjeuner gourmet",
          "Spa & bien-être",
          "Conciergerie 24/7",
        ],
        isPopular: true,
      },
      {
        name: "Luxe",
        price: 600,
        period: "nuit",
        features: [
          "Suite présidentielle",
          "Wifi ultra-rapide",
          "Chef privé",
          "Spa privatif",
          "Transfert aéroport",
          "Butler dédié",
        ],
      },
    ],
  },
  contact: {
    title: "Contactez-nous",
    description:
      "Nous sommes à votre disposition pour toute demande d'information.",
    email: "Lorem@mail.com",
    phone: "+33 00 00 000",
    address: "123 Rue Example, 75001 Paris",
    formFields: {
      name: "Votre nom",
      phone: "Votre numéro de téléphone",
      email: "Votre adresse e-mail",
      address: "Votre adresse",
      message: "Votre message",
    },
    submitButton: "Envoyer le message",
    image:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop",
  },
  footer: {
    logo: "/Logo.png",
    usefulLinks: [
      { label: "Nunc vulputate libero", href: "#" },
      { label: "Curabitur tempus", href: "#" },
      { label: "Vestibulum eu nisl", href: "#" },
      { label: "Inceptos himenaeos", href: "#" },
    ],
    legalLinks: [
      { label: "Mentions Légales", href: "#" },
      { label: "Politique de confidentialité", href: "#" },
      { label: "Conditions Générales", href: "#" },
      { label: "Contact", href: "#" },
    ],
    galleryImages: [
      "/footer-1.jpg",
      "/footer-2.jpg",
      "/footer-3.jpg",
      "/footer-4.jpg",
    ],
    tagline: "Adipiscing elit",
    copyright: "© 2026 SWEETHOME LUXURY. All rights reserved.",
  },
};
