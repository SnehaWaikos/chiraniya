import { Project, Service, Testimonial } from "./types";

export const servicesData: Service[] = [
  {
    id: "architecture",
    title: "Architecture",
    iconName: "architecture",
    summary: "Crafting structural narratives that breathe life into blueprints.",
    details: "Using cutting-edge spatial engine tech to create virtual walkthroughs with precise calculations, perfect sightlines, and real-time environment simulation before any earth is turned."
  },
  {
    id: "interior",
    title: "Interior",
    iconName: "layers",
    summary: "Curated spatial aesthetics designed with light, texture, and tranquility.",
    details: "Immersive multi-sensory rendering of custom millwork, curated materials, high-fidelity light bouncing, and bespoke furniture layouts designed to craft safe and deep aesthetic realms."
  },
  {
    id: "vastu",
    title: "Vastu",
    iconName: "token",
    summary: "Harmonizing spatial energy with ancient wisdom and modern precision.",
    details: "Combining classic cosmic placement sciences with physical space optimization to construct positive directional energies, flow of prana, and deep spiritual alignments."
  }
];

export const projectsData: Project[] = [
  {
    id: "gallery-living",
    title: "Gallery Living Space",
    category: "Duplex Interior",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwrGSiiEMvxDAIAMri4CWD8zNfa_1XYSFHZ2EMHyYYo8-1u4PRwgvOqlpQRZq0Skfd7sPRpNe2q7x1eFcGoBATb5Vthzr0GjEZt-YgfAJvm6u9vWtE7TPalmzYVlwRupadziNYF-RRYSRy4jRM-7kBmreW4NKiIIbzvgqtvSgBsSSqR0R0lGlVmPimOtpvZiDrSaiLI58JN6Zw-v2tIWEQMxgzf07Reoym7aQkCjDDSbhfVGdcBT6IqHULB7dS_od0HKpVSIS5Mgc",
    description: "A wide-angle duplex apartment interior featuring a dramatic architectural glass staircase with cascading lighting installations, polished concrete textures, and warm walnut wood paneling.",
    overlayData: {
      completed: "2025",
      materials: "Polished Concrete & Walnut",
      datum: "0.0m Base",
      level: "Level 14 Duplex"
    }
  },
  {
    id: "pinnacle-tower",
    title: "Pinnacle Tower Model",
    category: "Structural Walkthrough",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVPyzoRMzwfhSZ-HedocpzfldqqmyPvFq1N7AQ8Y3e1InPuiQcBRYRRTQl8JfYWOCPevFBWi2VSp6f5wvM1DvLKJVPVU1oaGJDpBfBZRIGKlodevDCqSRtAUTGE5XVVyxSzgRaxtq5bBzs89TS1Z3b_CHbxot_0jmBMq9hsoF-Okec1wUuNMT7CYk_7mSt01i8xj8_PkUlJ464qjDkQYS9zK1_QlwGDbrfUfxrlzOzL5OyTE3pxBvypi7rEEHXTStT3Sq38UFSL8Y",
    description: "High-fidelity architectural scale model highlighting precision facade structural components, FSC Certified Timber cladding, and a pristine roof terrace recreation.",
    overlayData: {
      completed: "2026",
      materials: "FSC Timber & Architectural Acrylic",
      datum: "+18.5m Datum",
      level: "Amenity Deck"
    }
  },
  {
    id: "misty-retreat",
    title: "Misty Garden Bedroom",
    category: "Serene Private Residence",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgBz0SWgdQcmoLdoBrklQeyYl4WQ0_A-mYEulMujMX5hVXlcVLgUZha6Sp-K97-5FHcg3Kj9oHLaolXCvOXAZUyfcE7sx5i7YTxy-GxMcENG0FI2CpKZcv9i0dmLZyQvCq2MlH0LH-FCdqhl9kR10mhSRA4EHOtWzl0FuFJP4f47Oi6hshBAmwPPHkmgrnow_i2OazQjBDhkTSm7W_c078XpdH-Mq_dLFSdK-t8OsdHbM00titGCHWhDf5A0R9SgGenndsqM6Jn9M",
    description: "A minimalist master bedroom layout incorporating low-profile furniture, custom premium textured sheets in Soft Teal, and grand glass windows revealing a peaceful misty pine garden.",
    overlayData: {
      completed: "2024",
      materials: "Linen, High-refraction Glass",
      datum: "-1.2m Subground",
      level: "West Wing Ground"
    }
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: "t1",
    quote: "The walkthrough felt so real we could almost feel the breeze through the rendered windows. Chiraniya transforms vision into tactile reality.",
    author: "Elias Thorne",
    role: "Thorne Estates CEO",
    rating: 5
  },
  {
    id: "t2",
    quote: "Spatial planning was simplified. Seeing our home in 3D liquid-glass detail before construction saved us countless revisions and costs.",
    author: "Sarah Jenkins",
    role: "Private Client",
    rating: 5
  },
  {
    id: "t3",
    quote: "Architecture is not just about buildings, it's about life. CHIRANIYA understands the soul of the space they create and translate into walk-throughs.",
    author: "Dr. Rajit Mehta",
    role: "Founder, LifeLabs",
    rating: 5
  }
];
