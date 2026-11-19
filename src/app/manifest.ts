import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Debpratim Sharma (Debprix) | Web Developer & Gen AI Engineer",
    short_name: "Debprix",
    description:
      "Official portfolio of Debpratim Sharma (Debprix) – Web Developer, Gen AI Engineer, and Freelancer based in Kolkata, India.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/navbar-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/navbar-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
