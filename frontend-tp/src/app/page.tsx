import Box from "@mui/material/Box";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PaymentBar from "@/components/PaymentBar";
import GameExplorer from "@/components/GameExplorer";
import PromoSection from "@/components/PromoSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string | string[]; category?: string | string[] }> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  const category = typeof params.category === "string" ? params.category : "Semua";
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Header />
      <Hero />
      <PaymentBar />
      <Box component="main" sx={{ flex: 1 }}>
        <GameExplorer query={query} category={category} />
        <PromoSection />
        <HowItWorks />
      </Box>
      <Footer />
    </Box>
  );
}
